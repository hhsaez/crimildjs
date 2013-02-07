define(["../third-party/gl-matrix"], function(glMatrix) {
	"use strict";

	return {
		factorial: function(n) {
			if (n === 0 || n === 1) {
				return 1;
			}

			var result = 1;
			for (var i = 2; i <= n; i++) {
				result = result * i;
			}
			return result;
		},

		binomialCoefficient: function(n, i) {
			return this.factorial(n) / (this.factorial(i) * this.factorial(n - i));
		},

		computeBezier3D: function(points, t, result) {
            if (!result) {
                result = vec3.create();
            }

            result[0] = 0;
            result[1] = 0;
            result[2] = 0;

            var vTemp = vec3.create();
            var n = points.length - 1;

            for (var i = 0; i <= n; i++) {
                var a = this.binomialCoefficient(n, i);
                var b = Math.pow(1 - t, n - i);
                var c = Math.pow(t, i);
                vec3.scale(points[i], a * b * c, vTemp);
                vec3.add(result, vTemp, result);
            }

            return result;
		},

		findRealRoots: function(a, b, c) {
			var discriminant = b * b - 4 * a * c;
			if (discriminant < 0) {
				return [];
			}
			else {
				var s = -b / 2 * a;
				if (discriminant == 0) {
					return [s];
				}
				else {
					var sqrtDiscriminant = Math.sqrt(discriminant) / a;
					var t0 = s + sqrtDiscriminant;
					var t1 = s - sqrtDiscriminant;
					return [t0, t1];
				}
			}
		},

		pow2roundUp: function(x, upperBound) {
			if (x < 0) {
				return 0;
			}

			--x;
			x |= x >> 1;
			x |= x >> 2;
			x |= x >> 4;
			x |= x >> 8;
			x |= x >> 16;
			
			if (upperBound) {
				return Math.min(upperBound, x + 1);
			}
			
			return x + 1;
		},
	}	
});

