!function (y, dp) {
    'use strict'
    // https://web.archive.org/web/20130316042726/https://www.w3.org/TR/file-writer-api/#the-filewriter-interface
    var TypedArray = Object.getPrototypeOf(Uint8Array.prototype).constructor
    var invalidPath = /[\/]|^\.\.?$/
    if (navigator.userAgent.includes('Windows')) invalidPath = /[\/\\]|^\.\.?$/
    function isInvalidPath(path) {
        return (!path || invalidPath.test(String(path)))
    }
    dp(navigator, 'storage', { value: navigator.storage || {} })
    // var type = 0
    var storage = navigator.storage
    var TARGET = Symbol('[[FileOrDirectory]]')
    var PARENTFOLDER = Symbol("[[ParentFolder]]")
    var WRITER = Symbol('[[Writer]]')
    var VERIFY = Symbol()
    function FileSystemHandle(name, kind) {
        y(this, {
            name: {
                value: name
            },
            kind: {
                value: kind
            }
        })
    }
    y(FileSystemHandle.prototype, {
        isSameEntry: {
            value: function isSameEntry(handle) {
                return handle[TARGET].fullPath === this[TARGET].fullPath
            }
        }
    })
    dp(FileSystemHandle.prototype, PARENTFOLDER, {
        get: function () {
            var x = this
            return new Promise(function (y, n) {
                x[TARGET].getParent(function (z) {
                    y(new (z.isFile ? FileSystemFileHandle : FileSystemDirectoryHandle)(z, z.name))
                }, n)
            })
        }
    })
    function FileSystemFileHandle(file, name) {
        FileSystemHandle.call(this, name, 'file')
        this[TARGET] = file
    }
    function WritableStream(FileWriter) {
        this[WRITER] = FileWriter
        this.locked = false
    }
    y(WritableStream.prototype, {
        // getWriter: {
        // value: function getWriter() {}
        // },
        close: {
            value: function close() {
                return Promise.resolve() // there is no 'close' method
            }
        },
        abort: {
            value: function abort() {
                var t = this[WRITER]
                return new Promise(function (r) {
                    function a() {
                        t.removeEventListener('abort', a)
                        r()
                    }
                    t.addEventListener('abort', a)
                    t.abort()
                })
            }
        }
    })
    function FileSystemWritableStream(FileWriter) {
        WritableStream.call(this, FileWriter)
    }
    y(FileSystemWritableStream.prototype = Object.create(WritableStream.prototype), {
        constructor: {
            value: FileSystemWritableStream
        },
        write: {
            value: function write(data) {
                if (typeof data === 'undefined') throw TypeError('data is undefined')
                var t = this
                var writer = t[WRITER]
                var d = data.data || data
                if (d instanceof ArrayBuffer ||
                    d instanceof TypedArray ||
                    d instanceof DataView ||
                    typeof d === 'string')
                    d = new Blob([d])
                switch (data.type) {
                    case 'write': {
                        var old = writer.position
                        writer.seek(data.position)
                        return t.write(d)
                            .then(function () {
                                writer.seek(old)
                            })
                    }
                        break
                    case 'truncate':
                        return this.truncate(data.size)
                    default:
                        return new Promise(function (y, n) {
                            function a() {
                                writer.removeEventListener('writeend', a)
                                writer.removeEventListener('error', a)
                                if (writer.error) n(writer.error)
                                else y()
                            }
                            writer.addEventListener('writeend', a)
                            writer.addEventListener('error', a)
                            writer.write(d)
                        })
                }
            }
        },
        truncate: {
            value: function truncate(size) {
                if (typeof size !== 'number') throw TypeError('Size must be a number')
                var t = this[WRITER]
                return new Promise(function (y, n) {
                    function a(e) {
                        if (e.type === 'writeend') {
                            t.removeEventListener('progress', a)
                            y()
                        }
                    }
                    t.addEventListener('progress', a)
                    t.truncate(size)
                })

            }
        },
        seek: {
            value: function seek(p) {
                if (typeof p !== 'number') throw TypeError('Position must be a number')
                return Promise.resolve(this[WRITER].seek(p))
            }
        }
    })
    y(FileSystemFileHandle.prototype = Object.create(FileSystemHandle.prototype), {
        constructor: {
            value: FileSystemFileHandle
        },
        getFile: {
            value: function getFile() {
                var t = this
                return new Promise(function (y, n) {
                    t[TARGET].file(y, n)
                })
            }
        },
        createWritable: {
            value: function createWritable(options) {
                var t = this
                return new Promise(function (y, n) {
                    t[TARGET].createWriter(function (FileWriter) {
                        y(new FileSystemWritableStream(FileWriter))
                    }, n)
                })
            }
        }
    })
    function FileSystemDirectoryHandle(dir, name) {
        var tag = dir[Symbol.toStringTag]
        var root
        if (tag === 'DOMFileSystem') root = dir.root
        else if (tag === 'DirectoryEntry') {
            root = dir
        }
        FileSystemHandle.call(this, name, 'directory')
        this[TARGET] = root
    }
    y(FileSystemDirectoryHandle.prototype = Object.create(FileSystemHandle.prototype), {
        constructor: {
            value: FileSystemDirectoryHandle
        },
        resolve: {
            value: function resolve(handle) {
                var targetPath = handle[TARGET].fullPath
                var dirPath = this[TARGET].fullPath
                if (!targetPath.startsWith(dirPath)) return Promise.resolve(null)
                var relative = targetPath.slice(dirPath.length).split('/').filter(Boolean)
                return Promise.resolve(relative)
            }
        },
        getFileHandle: {
            value: function getFileHandle(name, options) {
                if (isInvalidPath(name))
                    throw TypeError("Failed to execute 'getFileHandle' on 'FileSystemDirectoryHandle': Name is not allowed.")
                var t = this
                return new Promise(function (y, n) {
                    t[TARGET].getFile(name, options, function (entry) {
                        y(new FileSystemFileHandle(entry, name))
                    }, n)
                })
            }
        },
        getDirectoryHandle: {
            value: function getDirectoryHandle(name, options) {
                if (isInvalidPath(name))
                    throw TypeError("Failed to execute 'getDirectoryHandle' on 'FileSystemDirectoryHandle': Name is not allowed.")
                var t = this
                return new Promise(function (y, n) {
                    t[TARGET].getDirectory(name, options, function (FileSytemDirectoryEntry) {
                        y(new FileSystemDirectoryHandle(FileSytemDirectoryEntry, name, 'directory'))
                    }, n)
                })
            }
        },
        removeEntry: {
            value: function removeEntry(name, options) {
                var x = this
                var t = this[TARGET]
                if (isInvalidPath(name))
                    throw TypeError("Failed to execute 'removeEntry' on 'FileSystemDirectoryHandle': Name is not allowed.")
                var p = new Promise(function (r, rr) {
                    x.getFileHandle(name)
                        .then(r)
                        .catch(function () { return x.getDirectoryHandle(name).then(r) })
                        .catch(rr)
                })
                return new Promise(function (y, n) {
                    if (options && options.recursive) {
                        return p
                            .then(function (entry) {
                                if (entry.kind === 'directory') {
                                    return new Promise(function (r, n) { entry[TARGET].removeRecursively(r, n) })
                                } 
                                else return x.removeEntry(entry.name)
                            })
                            .then(y)
                            .catch(n)
                    }
                    return p
                        .then(function (e) {
                            return new Promise(function (y, n) {
                                e[TARGET].remove(y, n)
                            })
                        })
                        .then(y)
                        .catch(n)
                    // t[options && options.recursive ? 'removeRecursively' : 'remove'](name, y, n)
                })
            }
        },
        entries: {
            value: function entries() {
                var z = {}, t = this
                z[Symbol.asyncIterator] = function () {
                    var reader = t[TARGET].createReader()
                    var queue = []
                    var done = false
                    return {
                        next: function () {
                            function readMore() {
                                return new Promise(function (resolve, reject) {
                                    reader.readEntries(function (entries) {
                                        if (entries.length === 0) done = true
                                        else queue.push.apply(queue, entries)
                                        resolve()
                                    }, reject)
                                })
                            }
                            return (function step() {
                                if (queue.length) {
                                    var entry = queue.shift()
                                    var handle = entry.isFile
                                        ? new FileSystemFileHandle(entry, entry.name)
                                        : new FileSystemDirectoryHandle(entry, entry.name)
                                    return Promise.resolve({ value: [entry.name, handle], done: false })
                                }
                                if (done) return Promise.resolve({ done: true, value: undefined })
                                return readMore().then(step)
                            })()
                        }
                    }
                }
                return z
            }
        },
        keys: {
            value: function keys() {
                var z = {}, t = this
                z[Symbol.asyncIterator] = function () {
                    var reader = t[TARGET].createReader()
                    var queue = []
                    var done = false
                    return {
                        next: function () {
                            function readMore() {
                                return new Promise(function (resolve, reject) {
                                    reader.readEntries(function (entries) {
                                        if (entries.length === 0) done = true
                                        else queue.push.apply(queue, entries)
                                        resolve()
                                    }, reject)
                                })
                            }
                            return (function step() {
                                if (queue.length) {
                                    var entry = queue.shift()
                                    return Promise.resolve({ value: entry.name, done: false })
                                }
                                if (done) return Promise.resolve({ done: true, value: undefined })
                                return readMore().then(step)
                            })()
                        }
                    }
                }
                return z
            }
        },
        values: {
            value: function values() {
                var z = {}, t = this
                z[Symbol.asyncIterator] = function () {
                    var reader = t[TARGET].createReader()
                    var queue = []
                    var done = false
                    return {
                        next: function () {
                            function readMore() {
                                return new Promise(function (resolve, reject) {
                                    reader.readEntries(function (entries) {
                                        if (entries.length === 0) done = true
                                        else queue.push.apply(queue, entries)
                                        resolve()
                                    }, reject)
                                })
                            }
                            return (function step() {
                                if (queue.length) {
                                    var entry = queue.shift()
                                    var handle = entry.isFile
                                        ? new FileSystemFileHandle(entry, entry.name)
                                        : new FileSystemDirectoryHandle(entry, entry.name)
                                    return Promise.resolve({ value: handle, done: false })
                                }
                                if (done) return Promise.resolve({ done: true, value: undefined })
                                return readMore().then(step)
                            })()
                        }
                    }
                }
                return z
            }
        }
    })
    storage.estimate ||
    dp(storage, 'estimate', {
        value: function estimate() {
            return new Promise(function (resolve, reject) {
                navigator.webkitTemporaryStorage.queryUsageAndQuota(function (usage, quota) {
                    resolve({
                        quota: quota,
                        usage: usage
                    })
                }, reject)
            })
        }
    })
    storage.getDirectory || 
    dp(storage, 'getDirectory', {
        value: function getDirectory() {
            return new Promise(function (resolve, reject) {
                storage.estimate()
                    .then(function (b) {
                        return new Promise(function (res, rej) {
                            webkitRequestFileSystem(0, b.quota, res, rej)
                        })
                    })
                    .then(function (FileSystem) {
                        resolve(new FileSystemDirectoryHandle(FileSystem, ''))
                    })
                    .catch(reject)
            })
        }
    })
    storage.persist ||
    dp(storage, 'persist', {
        value: function persist() {
            return new Promise(function (resolve, reject) {
                storage.estimate()
                    .then(function (b) {
                        return new Promise(function (res, rej) {
                            webkitRequestFileSystem(0, b.quota, res, rej)
                        })
                    })
                    .then(function () {
                        resolve(false)
                    })
                    .catch(reject)
            })
        }
    })
    storage.persisted ||
    dp(storage, 'persisted', {
        value: function persisted() { return Promise.resolve(false) }
    })
}(Object.defineProperties, Object.defineProperty)
