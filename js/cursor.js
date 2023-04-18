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
        this.alive = false

        this.setUpInputs()
    }

    notFlashing() {
        this.coolDown = 50
        this.count = 0
    }

    setUpInputs() {
        let canvas = this.editor.canvas
        let editor = this.editor
        // 绑定 click 事件
        canvas.addEventListener('click', (event) => {
            this.show()
            let codeObj = editor.codeObj
            // 拿到行数
            let row = Math.floor(event.offsetY / editor.lineHeight)
            // 根据行数拿到数据
            let line = codeObj[row]
            let x = 0
            // 如果 line 为空，则拿到最后一行最后一个字符的位置
            // 否则去根据 token x 和 offsetX 去相减，拿到绝对值的最小值
            // 返回这个差的 token x
            if (line === undefined) {
                line = codeObj[codeObj.length - 1]
                x = line[line.length - 1].x - (line[line.length - 1].w / 2)
            } else {
                let offsetX = 100000
                for (const token of line) {
                    let subX = Math.abs(token.x - event.offsetX)
                    if (subX < offsetX) {
                        x = token.x - (token.w / 2)
                        offsetX = subX
                    }
                }
            }
            // 设置 光标 的位置
            this.x = x
            this.y = line[0].y
        })
        canvas.addEventListener('blur', (event) => {
            this.stop()
        })
    }

    show() {
        this.alive = true
    }

    stop() {
        this.alive = false
    }

    update() {
    }

    draw() {
        if (this.alive) {
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
}
