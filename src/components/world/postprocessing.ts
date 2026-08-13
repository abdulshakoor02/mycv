'use client'

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

/* ------------------------------------------------------------------ */
/* Post-processing chain — mirrors Kage's finish: render to a half-    */
/* float buffer, feed only HDR-bright emitters into a mip-chained      */
/* bloom, then a single final shader applies ACES tone mapping,        */
/* teal-shadow / warm-highlight grade, chromatic aberration, film      */
/* grain and vignette.                                                 */
/* ------------------------------------------------------------------ */

const FinishShader = {
  name: 'SystemsObservatoryFinish',
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uGrain: { value: 0.045 },
    uVig: { value: 0.62 },
    uSat: { value: 1.04 },
    uExposure: { value: 0.78 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uRes;
    uniform float uGrain;
    uniform float uVig;
    uniform float uSat;
    uniform float uExposure;
    varying vec2 vUv;

    vec3 aces(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    }

    void main() {
      vec2 d = vUv - 0.5;
      float r2 = dot(d, d);

      // restrained chromatic aberration, stronger at the frame edge
      float ca = (0.30 + r2 * 2.6) * 0.0012;
      vec3 c;
      c.r = texture2D(tDiffuse, vUv + d * ca).r;
      c.g = texture2D(tDiffuse, vUv).g;
      c.b = texture2D(tDiffuse, vUv - d * ca).b;

      c *= uExposure;
      c = aces(c);

      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l), c, uSat);

      // teal shadows, warm highlights
      c = mix(c, c * vec3(0.74, 1.03, 1.11), smoothstep(0.55, 0.0, l) * 0.80);
      c = mix(c, c * vec3(1.035, 0.995, 0.968), smoothstep(0.50, 1.0, l) * 0.26);

      // vignette
      float v = smoothstep(1.22, 0.26, length(d * vec2(1.0, 0.94)) * 1.42);
      c *= mix(1.0, v, uVig);

      // film grain
      float g = fract(sin(dot(vUv * uRes + uTime * 137.0, vec2(12.9898, 78.233))) * 43758.5453);
      c += (g - 0.5) * uGrain;

      // encode to sRGB for the screen; then a touch of contrast pivoted low
      // so it deepens the night without crushing the lit accents.
      vec3 e = pow(max(c, 0.0), vec3(1.0 / 2.2));
      e = clamp((e - 0.30) * 1.0 + 0.30, 0.0, 1.0);
      gl_FragColor = vec4(e, 1.0);
    }
  `,
}

export type PostPipeline = {
  composer: EffectComposer
  bloom: UnrealBloomPass
  finish: ShaderPass
  resize: (w: number, h: number, dpr: number) => void
  dispose: () => void
}

export function createPostPipeline(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  opts: { reducedMotion: boolean; low: boolean },
): PostPipeline {
  const w = renderer.domElement.width
  const h = renderer.domElement.height

  const renderTarget = new THREE.WebGLRenderTarget(w, h, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
    depthBuffer: true,
    samples: opts.low ? 0 : 2,
  })

  const composer = new EffectComposer(renderer, renderTarget)
  composer.renderToScreen = true

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), opts.low ? 0.5 : 0.72, 0.55, 0.82)
  bloom.threshold = 0.82
  bloom.strength = opts.low ? 0.5 : 0.72
  bloom.radius = 0.55
  composer.addPass(bloom)

  const finish = new ShaderPass(FinishShader)
  finish.uniforms.uRes.value.set(w, h)
  finish.uniforms.uGrain.value = opts.reducedMotion ? 0 : opts.low ? 0.035 : 0.045
  composer.addPass(finish)

  return {
    composer,
    bloom,
    finish,
    resize: (nw: number, nh: number, dpr: number) => {
      composer.setPixelRatio(dpr)
      composer.setSize(nw, nh)
      bloom.resolution.set(nw * dpr, nh * dpr)
      finish.uniforms.uRes.value.set(nw * dpr, nh * dpr)
    },
    dispose: () => {
      composer.dispose()
      bloom.dispose()
      finish.dispose()
      renderTarget.dispose()
    },
  }
}
