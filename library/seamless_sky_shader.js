(() => {

    const VERTEX = `...`;

    const FRAGMENT = `
    uniform float iTime;
    uniform vec3 color;

    varying vec2 vUv;

    vec2 hash( vec2 p ) {
        p = vec2( dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
        return fract(sin(p)*43758.5453);
    }

        
    void main() {
        vec2 uv = vUv;
        
        float scale = 20.0;
        float radius = 0.01;
        
        vec4 starColor = vec4(0.0, 0.0, 0.0, 1.0);
        
        vec2 gridPosition = floor(uv * scale) / scale;
        
        vec2 randomOffset = hash(gridPosition) * 2.0 - 1.0;
        randomOffset *= 0.5;
        
        vec2 localGridPositionCenter = fract(uv * scale) - 0.5;
        
        starColor.rgb += step(length(localGridPositionCenter + randomOffset), radius);

        starColor.g *= (step(sin(iTime * randomOffset.x), 0.1) + 0.7);
        starColor.b *= (step(sin(iTime * randomOffset.y), 0.1) + 0.7);

        float imageStrength = clamp((-pow(6.0 * (vUv.y - 0.5), 3.0)) + 1.0, 0.0, 1.0);
        gl_FragColor = mix(starColor, vec4(color, 1.0), imageStrength);
    }
    `;

    AFRAME.registerComponent('sky-material', {
        schema: {
            color: {
                type: 'color',
                default: '#151141',
            },
        },
        init() {
            const data = this.data;
            const hex = data.color;

            this.uniforms = {
                iTime: { type: 'f', value: 0.0 },
                color: { value: this.getColorVec(hex) }
            };

            this.material = new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: VERTEX,
                fragmentShader: FRAGMENT,
            });

            this.applyToMesh();
            this.el.addEventListener('model-loaded', () => this.applyToMesh());
        },
        update() {
            const hex = this.data.color;
            this.uniforms.color.value = this.getColorVec(hex);
        },
        getColorVec(hex) {
            const color = new THREE.Color(hex);
            return new THREE.Vector3(color.r, color.g, color.b);
        },
        // ...
    });

})();