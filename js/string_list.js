
// 读字符串
class StringList extends GuaObject {
    constructor(string) {
        super()
        this.string = string
        this.index = 0
    }

    // 读到当前 index 的字符
    readChar() {
        var i = this.index
        this.index += 1
        if (i < this.string.length()) {
            return this.string[i]
        } else {
            return null
        }
    }

    // 看一下当前 index 的字符
    peekChar() {
        var i = this.index
        if (i < this.string.length()) {
            return this.string[i]
        } else {
            return null
        }
    }

    // 看一下当前 index，index + 2 的字符
    peekCharThree() {
        var i = this.index
        var len = this.string.length()
        if (i < len && i + 2 < len) {
            return this.string.cut(i, i + 3)
        } else {
            return null
        }
    }

    // 看一下当前 index，index + 1 的字符
    peekCharTwo() {
        var i = this.index
        var len = this.string.length()
        if (i < len && i + 1 < len) {
            return this.string.cut(i, i + 2)
        } else {
            return null
        }
    }

    // 判断是否有字符
    hasChar() {
        return this.index < this.string.length()
    }

    // 减去 index 值
    subIndex(index=1) {
        this.index -= index
    }
}
