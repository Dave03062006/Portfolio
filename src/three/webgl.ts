/**
 * Whether this browser can draw 3D (WebGL). Some old devices can't, and some people
 * switch it off. When it's missing, the flat logo stays on screen instead.
 */
export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    // Release the test context straight away; browsers only allow a few at a time.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return gl !== null
  } catch {
    return false
  }
}
