class Code extends GuaObject {
    constructor(editor, tokenList) {
        super()
        this.editor = editor
        this.codeObj = []
        this.tokenList = tokenList
        this.init(tokenList)
    }

    init() {


        log(this.codeObj)
    }

    update() {

    }

    drawLine(index) {
        let ctx = this.context
        let i = index + 1
        // 画框框
        // ctx.fillStyle = '#999'
        // ctx.fillRect(0,0, this.startX, this.lineHeight)
        // 画行数
        ctx.fillStyle = '#555'
        ctx.fillText(i, this.startX - this.fontSize, this.lineHeight * i - this.paddingDown)
    }

    draw() {
        let editor = this.editor
        let ctx = this.editor.context
        ctx.font = `${editor.fontSize}px ${editor.font}`
        for (let i = 0; i < this.codeObj.length; i++) {
            let line = this.codeObj[i]
            this.drawLine(i)
            let offsetY = (i + 1) * editor.lineHeight - editor.paddingDown
            let offsetX = editor.startX
            for (const token of line) {
                token.draw()
            }
        }
    }
}
