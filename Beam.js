class Beam {
    constructor(settings) {
        this.settings = settings;

        // ############  Fading Circle #########
        this.rotationCounter = 0
        this.rotationSpeed = 0.02
        this.hueC = 0

        this.flashBeamRotation = 0
        this.flash = true
    }

    // ############  Fading Circle #########

    modeFadingCircle() {

        this.hueC++
        if (this.hueC > 253) {
            this.hueC = 0
        }
        let v = Helper.polarToCartesian(height / 3, this.rotationCounter)

        noFill()
        colorMode(HSB);
        stroke(this.hueC, 255, 255)
        strokeWeight(10)
        ellipse(v.x * ratio, v.y, 140, 110);
        ellipse(-v.x * ratio, -v.y, 140, 110);
        colorMode(RGB)
        this.rotationCounter = (this.rotationCounter + this.rotationSpeed) % (TWO_PI)
        //console.log("rotationCounter: " + rotationCounter)
        if (this.rotationCounter < 0.02) {
            Helper.reset()
        }
    }

    // ############  Flashing Beams #########

    flash3Beams() {
        this.flash = !this.flash
        if (this.flash) {
            this.flashBeamRotation = this.modeBeams(3, color(255, 255, 255), this.flashBeamRotation, false)
        }

    }



    modeBeams(number, c, currentRotation, direction = false, diameter = halfHeight, changeHight) {

        currentRotation = direction ? currentRotation + 0.01 : currentRotation - 0.02
        let pos = Helper.polarToCartesian(diameter, currentRotation)

        for (let i = 0; i < number; i++) {
            pos = Helper.polarToCartesian(diameter, currentRotation + (i / number * TWO_PI))
            if (changeHight) {

                this.drawDot(pos.x * ratio, pos.y * sin(currentRotation), c)
            }
            else {
                this.drawDot(pos.x * ratio, pos.y, c)
            }
        }
        return currentRotation

    }




    drawDot(x, y, c, size = 20) {
        strokeWeight(size);
        stroke(c)
        point(x, y);
    }

}
