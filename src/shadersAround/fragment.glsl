uniform float time;
uniform samplerCube uPerlin;
varying vec3 vPosition;
varying vec3 vNormal;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;

vec3 brightnessToColor( float b){
  b*= 0.25;
  return (vec3(b,b*b, b*b*b*b)/0.25)*0.8;
}

float Fresnel(vec3 eyeVector, vec3 worldNormal){
  return pow(1.2 + dot(eyeVector, worldNormal),4.0);
}


float superSun(){
  float sum = 0.;
  sum += textureCube(uPerlin, vLayer0).r;
  sum += textureCube(uPerlin, vLayer1).r;
  sum += textureCube(uPerlin, vLayer2).r;
  return sum;
}

void main(){

  float radial = 1. - vPosition.z;

  radial *= radial;

  radial -= radial/4.;


  float brightness = 1.+ radial*0.83;

  gl_FragColor.rgb = brightnessToColor(brightness)*radial ;
  gl_FragColor.a = radial*radial*radial*radial;
  // vec3 col = brightnessToColor(brightness);
 

  // gl_FragColor = vec4(radial,0.0,0.0,1.0);
  // gl_FragColor = vec4(vec3(fres),1.0);
}
