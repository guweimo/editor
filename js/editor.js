
class Editor extends GuaObject {
    constructor(code) {
        super()
        this.code = code
        let tl = tokens(this.code)
        log('tl', tl)
    }
    draw() {

    }

    update() {

    }
}



const __main = function() {
    let code = 'const a = 1'
    Editor.new(code)
}

__main()
