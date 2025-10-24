class Bar {

    constructor(settings) {
        this.settings = settings
        this.vStart = createVector(leftEdge, bottomPos)
        this.vEnd = createVector(rightEdge, bottomPos)
        this.scannerCounter = 0
        this.scannerSteps = 200
        this.scannerWidth = 15



        this.sectionHeight = 20
        this.sectionWidthPercent = 0.5

        this.vStartSplitter = createVector(0, bottomPos + this.sectionHeight)
        this.vEndSplitter = createVector(0, topPos - this.sectionHeight)
    }

    display() {
        circle(this.x, this.y, 50);
    }


    movingBarLeftRight(singleDouble, scannerSpeed = 1) {

        this.scannerCounter += scannerSpeed
        this.scannerCounter = this.scannerCounter % this.scannerSteps
        if (this.scannerCounter < 0.3) {
            Helper.reset()
        }

        let barPos = Helper.pingPong(this.vStart, this.vEnd, this.scannerSteps, this.scannerCounter)
        this.drawBarGreen(barPos.x, barPos.y, this.scannerWidth, this.settings.height)
        if (singleDouble) {
            this.drawBarGreen(-barPos.x, barPos.y, this.scannerWidth, this.settings.height)
        }
    }


    movingBarSplitterTopBottom(splits, scannerSpeed = 1) {


        this.scannerCounter += scannerSpeed
        this.scannerCounter = this.scannerCounter % this.scannerSteps

        let sectionWidth = width / splits

        let barPos = Helper.pingPong(this.vStartSplitter, this.vEndSplitter, this.scannerSteps, this.scannerCounter)
        for (let i = 0; i < splits; i++) {
            if (i % 2 == 0) {
                this.drawWhiteBar(-width / 2 + i * sectionWidth, -barPos.y, sectionWidth * this.sectionWidthPercent, this.sectionHeight)
            }
            else {
                this.drawWhiteBar(-width / 2 + i * sectionWidth, barPos.y, sectionWidth * this.sectionWidthPercent, this.sectionHeight)
            }
        }
    }

    drawBarGreen(x, y, w, h) {
        this.drawBar(x, y, w, h, 0, 255, 0)
    }

    drawWhiteBar(x, y, w, h) {
        this.drawBar(x, y, w, h, 255, 255, 255);
    }

    drawBar(x, y, w, h, r, g, b) {
        fill(r, g, b);
        noStroke();
        rect(x, y, w, h);
    }
}
