let fontSize = 18
let font = 'Menlo'
class Editor extends GuaObject {

    constructor(code) {
        super()
        this.code = code
        this.tokenList = tokens(this.code)
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        this.lines = []
        this.init()
    }

    init() {
        // 按行生成数据
        let line = []
        for (let item of this.tokenList) {
            if (item.value === '\n') {
                this.lines.push(line)
                line = []
                continue
            }
            line.push(item)
        }
        line.push(Token.new('\n', Token.lineBreak))
        this.lines.push(line)
        this.__start()
    }

    __start() {
        var g = this
        // 开始运行程序
        // setTimeout(function() {
            g.runLoop()
        // }, 1000 / 60)
    }

    runLoop() {
        let g = this

        // update x
        g.update()

        // clear
        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)

        // draw
        g.draw()

        // next run loop
        setTimeout(function() {
            g.runLoop()
        }, 1000 / 60)
    }

    draw() {
        log('into')
        let ctx = this.context
        ctx.font = `${fontSize}px ${font}`
        let startX = fontSize + 10
        let offsetX = startX
        let lineHeight = fontSize + 5
        let offsetY = lineHeight
        log('this.lines', this.lines)
        for (const line of this.lines) {
            for (const token of line) {
                let value = token.value
                if (value === ' ') {
                    value = ' · '
                }
                let type = token.type
                ctx.fillStyle = Palette[type]
                ctx.fillText(value, offsetX, offsetY)
                let w = ctx.measureText(value).width
                offsetX += w
            }
            offsetX = startX
            offsetY += lineHeight
        }
    }

    update() {

    }
}



const __main = function() {
    let code = `const a = 1
const b = 'test'`
    let e = Editor.new(code)
}

__main()
