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
        this.select = false
        this.selectList = []

        this.setUpInputs()
    }

    notFlashing() {
        this.coolDown = 50
        this.count = 0
    }

    setUpInputs() {
        let editor = this.editor
        let canvas = editor.canvas
        let textarea = editor.textarea
        let isMouse = false
        // 绑定 click 事件
        canvas.addEventListener('click', () => {
            log('click', isMouse)
            if (!isMouse) {
                this.click()
            }
        })
        canvas.addEventListener('mousedown', () => {
            isMouse = true
            this.select = false
            this.selectList = []

            let editor = this.editor
            let codeObj = editor.codeObj
            // 拿到行数
            let row = Math.floor(event.offsetY / editor.lineHeight)
            // 根据行数拿到数据
            let line = codeObj[row]
            let token = null
            // 如果 line 为空，则拿到最后一行最后一个字符的位置
            // 否则去根据 token x 和 offsetX 去相减，拿到绝对值的最小值
            // 返回这个差的 token x
            if (line === undefined) {
                line = codeObj[codeObj.length - 1]
                token = line[line.length - 1]
            } else {
                let offsetX = 100000
                for (const t of line) {
                    let subX = Math.abs(t.x - event.offsetX)
                    if (subX < offsetX) {
                        token = t
                        offsetX = subX
                    }
                }
            }
            // 设置 光标 的位置
            this.col = token.col
            this.row = token.row
            this.selectList.push({col: this.col, row: this.row})
        })
        canvas.addEventListener('mousemove', () => {
            if (isMouse) {
                this.select = true
                let editor = this.editor
                let codeObj = editor.codeObj
                // 拿到行数
                let row = Math.floor(event.offsetY / editor.lineHeight)
                // 根据行数拿到数据
                let line = codeObj[row]
                let token = null
                // 如果 line 为空，则拿到最后一行最后一个字符的位置
                // 否则去根据 token x 和 offsetX 去相减，拿到绝对值的最小值
                // 返回这个差的 token x
                if (line === undefined) {
                    line = codeObj[codeObj.length - 1]
                    token = line[line.length - 1]
                } else {
                    let offsetX = 100000
                    for (const t of line) {
                        let subX = Math.abs(t.x - event.offsetX)
                        if (subX < offsetX) {
                            token = t
                            offsetX = subX
                        }
                    }
                }
                // 设置 光标 的位置
                this.col = token.col
                this.row = token.row
                this.selectList[1] = {col: this.col, row: this.row}
            }
        })
        canvas.addEventListener('mouseup', () => {
            isMouse = false
        })
        textarea.addEventListener('blur', () => {
            // isMouse = false
        })

        let moveKey = {
            ArrowLeft: 'left',
            ArrowRight: 'right',
            ArrowUp: 'up',
            ArrowDown: 'down',
            Home: 'home',
            End: 'end',
        }
        textarea.addEventListener('keydown', (event) => {
            let key = event.key
            if (Object.hasOwn(moveKey, key)) {
                this.move(moveKey[key])
            }
        })
    }

    moveLeft() {
        let col = this.col
        let row = this.row
        let codeObj = this.editor.codeObj
        let line = codeObj[row]
        col -= 1
        // 小于零时，说明要去上一行
        if (col < 0) {
            row -= 1
            line = codeObj[row]
        }

        // 看上一行是否有数据，没有数据就恢复原来的位置
        // 有数据就拿到上一行的最后一列位置
        if (line === undefined) {
            col = this.col
            row = this.row
        } else if (col < 0) {
            col = line.length - 1
        }
        this.row = row
        this.col = col
    }

    moveRight() {
        let col = this.col
        let row = this.row
        let codeObj = this.editor.codeObj
        let line = codeObj[row]
        col += 1
        // 小于零时，说明要去上一行
        let currentLength = line.length
        if (col >= currentLength) {
            row += 1
            line = codeObj[row]
            col = 0
        }

        // 看下一行是否有数据，没有数据就恢复原来的位置
        // 有数据就拿到下一行的最后一列位置
        if (line === undefined) {
            col = this.col
            row = this.row
        }
        this.row = row
        this.col = col
    }

    moveUp() {
        let col = this.col
        let row = this.row
        let codeObj = this.editor.codeObj
        row -= 1
        let line = codeObj[row]
        // 看上一行是否有数据，没有数据就恢复原来的位置
        // 否则看上一行的列是否存在，不存在就拿到上一行最后一列的位置
        if (line === undefined) {
            col = this.col
            row = this.row
        } else if (line[col] === undefined) {
            col = line.length - 1
        }

        this.row = row
        this.col = col
    }

    moveDown() {
        let col = this.col
        let row = this.row
        let codeObj = this.editor.codeObj
        row += 1
        let line = codeObj[row]
        // 看上一行是否有数据，没有数据就恢复原来的位置
        // 否则看上一行的列是否存在，不存在就拿到上一行最后一列的位置
        if (line === undefined) {
            col = this.col
            row = this.row
        } else if (line[col] === undefined) {
            col = line.length - 1
        }

        this.row = row
        this.col = col
    }

    moveLine(direction) {
        let col = this.col
        let row = this.row
        let codeObj = this.editor.codeObj
        let line = codeObj[row]

        if (direction === 'home') {
            col = 0
        } else if (direction === 'end') {
            col = line.length - 1
        }

        this.row = row
        this.col = col
    }

    move(direction) {
        if (direction === 'left') {
            this.moveLeft()
        } else if (direction === 'right') {
            this.moveRight()
        } else if (direction === 'up') {
            this.moveUp()
        } else if (direction === 'down') {
            this.moveDown()
        } else if (direction === 'home' || direction === 'end') {
            this.moveLine(direction)
        }

       this.resident()
    }

    resident() {
        this.count = 0
        this.coolDown = 50
    }

    click() {
        this.show()

        let editor = this.editor
        let codeObj = editor.codeObj
        // 拿到行数
        let row = Math.floor(event.offsetY / editor.lineHeight)
        // 根据行数拿到数据
        let line = codeObj[row]
        let token = null
        // 如果 line 为空，则拿到最后一行最后一个字符的位置
        // 否则去根据 token x 和 offsetX 去相减，拿到绝对值的最小值
        // 返回这个差的 token x
        if (line === undefined) {
            line = codeObj[codeObj.length - 1]
            token = line[line.length - 1]
        } else {
            let offsetX = 100000
            for (const t of line) {
                let subX = Math.abs(t.x - event.offsetX)
                if (subX < offsetX) {
                    token = t
                    offsetX = subX
                }
            }
        }
        // 设置 光标 的位置
        this.col = token.col
        this.row = token.row
        this.resident()
    }

    show() {
        this.alive = true
    }

    stop() {
        this.alive = false
    }

    update() {
        let col = this.col
        let row = this.row
        let codeObj = this.editor.codeObj
        let token = codeObj[row][col]
        this.x = token.x - (token.w / 2)
        this.y = token.y

        let textarea = this.editor.textarea
        textarea.style.left = this.x + 'px'
        textarea.style.top = this.y + 'px'
        textarea.focus()
    }

    sort() {
        let a = this.selectList[0]
        let b = this.selectList[1]
        if (a.row > b.row) {
            return [b, a]
        } else if (a.row === b.row && a.col > b.col) {
            return [b, a]
        } else if (a.row === b.row && a.col === b.col) {
            return null
        }

        return [a, b]
    }

    draw() {
        let editor = this.editor
        let ctx = editor.context
        if (this.alive) {
            this.coolDown--
            if (this.coolDown === 0) {
                this.count = (this.count + 1) % 2
                this.coolDown = 30
            }
            if (this.count === 0) {
                ctx.fillStyle = 'red'
                ctx.fillText('|', this.x, this.y)
            }
        }

        if (this.selectList.length > 1) {
            let codeObj = editor.codeObj
            let selectList = this.sort()
            if (selectList === null) {
                return
            }
            log('selectList', selectList)
            let a = selectList[0]
            let b = selectList[1]
            ctx.fillStyle = '#F8E88394'

            let start = a.col
            for (let row = a.row; row < b.row+1; row++) {
                let line = codeObj[row]
                let end = line.length
                //
                if (row === b.row)  {
                    end = b.col
                }
                for (let col = start; col < end; col++) {
                    let t = line[col]
                    log('t', t)
                    ctx.fillRect(t.x, t.y - editor.lineHeight + editor.paddingDown + 2, t.w, editor.lineHeight)
                }
                start = 0
            }
        }
    }
}
