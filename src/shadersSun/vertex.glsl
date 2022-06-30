uniform float time;

varying vec3 vertexNormal;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;

float PI = 3.141592653589793238;

mat2 rotate(float a){
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}


void main()	{
  vertexNormal = normalize(normalMatrix * normal);

  vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);

  eyeVector = normalize(worldPosition.xyz - vertexNormal);

  float t = time*0.005;

  mat2 rot = rotate(t);

  vec3 p0 = position;
  p0.yz = rot*p0.yz;
  vLayer0 = p0;

  mat2 rot1 = rotate(t+10.);
  vec3 p1 = position;
  p1.xz = rot1*p1.xz;
  vLayer1 = p1;

  mat2 rot3 = rotate(t+30.);
  vec3 p2 = position;
  p2.xy = rot3*p2.xy;
  vLayer2 = p2;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
