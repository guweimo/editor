class Cursor extends GuaObject {
    constructor(editor) {
        super()
        this.editor = editor
        this.row = 0
        this.col = 0
        this.x = 0
        this.y = 0
        this.coolDown = 30
        this.count = 0
    }

    update() {

    }

    draw() {
        this.coolDown--
        if (this.coolDown === 0) {
            this.count = (this.count + 1) % 2
            this.coolDown = 30
        }
        if (this.count === 0) {
            let ctx = this.editor.context
            ctx.fillStyle = 'red'
            ctx.fillText('|', this.x, this.y)
        }
    }
}
