class Code extends GuaObject {
    constructor(editor) {
        super()
        this.editor = editor
    }

    init() {

    }

    update() {
        let editor = this.editor
        let ctx = editor.context
        for (let index in editor.codeObj) {
            let line = editor.codeObj[index]
            let x = editor.startX
            let y = (Number(index) + 1) * editor.lineHeight - editor.paddingDown
            for (const token of line) {
                token.y = y
                token.x = x
                token.w = ctx.measureText(token.value).width
                x += token.w
            }
        }
    }

    drawLine(index) {
        let editor = this.editor
        let ctx = editor.context
        let i = index + 1
        // 画框框
        // ctx.fillStyle = '#999'
        // ctx.fillRect(0,0, this.startX, this.lineHeight)
        // 画行数
        ctx.fillStyle = '#555'
        ctx.fillText(i, editor.startX - editor.fontSize, editor.lineHeight * i - editor.paddingDown)
    }

    draw() {
        let editor = this.editor
        let ctx = editor.context
        ctx.font = `${editor.fontSize}px ${editor.font}`
        for (let i = 0; i < editor.codeObj.length; i++) {
            let line = editor.codeObj[i]
            this.drawLine(i)
            for (const token of line) {
                let value = token.value
                if (value === ' ') {
                    value = '•'
                }
                let type = token.type
                ctx.fillStyle = Palette[type]
                ctx.fillText(value, token.x, token.y)
            }
        }
    }
}
