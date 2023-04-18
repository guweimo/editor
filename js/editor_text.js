class EditorText extends Token {
    constructor(editor, value, type, row, col) {
        super(value, type)
        this.editor = editor
        this.row = row
        this.col = col
        this.x = 0
        this.y = 0
    }

    update() {
        let editor = this.editor
        this.y = (this.row + 1) * editor.lineHeight - editor.paddingDown
    }

    draw() {

    }
}
