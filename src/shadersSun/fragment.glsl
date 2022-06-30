uniform float time;
uniform samplerCube uPerlin;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;
varying vec3 vertexNormal;

vec3 brightnessToColor( float b){
  b*= 0.25;
  return (vec3(b,b*b, b*b*b*b)/0.25)*0.8;
}

float Fresnel(vec3 eyeVector, vec3 worldNormal){
  return pow(1.5 + dot(eyeVector, worldNormal),10.0);
}


float superSun(){
  float sum = 0.;
  sum += textureCube(uPerlin, vLayer0).r;
  sum += textureCube(uPerlin, vLayer1).r;
  sum += textureCube(uPerlin, vLayer2).r;
  return sum;
}

void main(){

  float fres = Fresnel(eyeVector, vertexNormal);

  float brightness = superSun();
  brightness = brightness*1.2+ 1.;
  brightness += pow(fres,0.2);

  vec3 col = brightnessToColor(brightness);

  gl_FragColor = vec4(col,1.0);
  // gl_FragColor = vec4(vec3(fres),1.0);
}
