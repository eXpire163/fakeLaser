class Helper {
    // Example static method
    static reset() {
        console.log("reset")
    }
    //lerp including reverse
    static pingPong(vStart, vEnd, steps, currrentStep) {

        if (currrentStep < steps / 2) {
            let delta = float(currrentStep) / (steps / 2)
            return p5.Vector.lerp(vStart, vEnd, delta)
        }
        let delta = float(currrentStep - (steps / 2)) / (steps / 2)
        return p5.Vector.lerp(vEnd, vStart, delta)
    }

    static polarToCartesian(r, theta) {
        // Convert polar to cartesian
        let x = r * cos(theta);
        let y = r * sin(theta);
        return createVector(x, y)
    }
}
