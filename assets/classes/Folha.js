const Estilo = require("./Estilo")
const Blocos = require("./Blocos")
const Texto = require("./Texto")
const Imagem = require("./Imagem")
const Lista = require("./Lista")
const Tabela = require("./Tabela")
const Audio = require("./Audio")
const Video = require("./Video")
const GravadorAudio = require("./GravadorAudio")

const { clipboard, Tray } = require("electron")
const fs = require("fs")
const { app, globalShortcut } = require("electron")

class Folha extends Estilo {
  constructor(options) {
    super()
    this.blocos = []
    this.folhaContainer = options.folhaContainer
    this.zIndexBlocoMin = 5
    this.zIndexBlocoMax = 300
    this.imageCount = -1
    this.loadedFonts = options.loadedFonts
    this.mouseX = 0
    this.mouseY = 0
    this.scrollPadding = 20
    this.scrollAdd = 200
    this.windowOnMouseMoveActions = []
    // window.onkeydown = e => {
    //   if (e.ctrlKey && e.keyCode == 84) {
    //     const { x, y } = this.getMousePos(100, 50)
    //     this.criarTexto({
    //       posX: x,
    //       posY: y,
    //       initialWidth: 100,
    //       initialHeight: 50
    //     })
    //   } else if (e.ctrlKey && e.keyCode == 73) {
    //     const { x, y } = this.getMousePos(400, 400)
    //     this.criarImagem({
    //       posX: x,
    //       posY: y,
    //       initialWidth: 400,
    //       initialHeight: 400
    //     })
    //   } else if (e.ctrlKey && e.keyCode == 76) {
    //     const { x, y } = this.getMousePos(400, 400)
    //     this.criarLista({
    //       posX: x,
    //       posY: y,
    //       initialWidth: 400,
    //       initialHeight: 400
    //     })
    //   } else if (e.ctrlKey && e.keyCode == 71) {
    //     const { x, y } = this.getMousePos(400, 400)
    //     this.criarTabela({
    //       posX: x,
    //       posY: y,
    //       initialWidth: 400,
    //       initialHeight: 400
    //     })
    //   } else if (e.ctrlKey && e.keyCode == 75) {
    //     const { x, y } = this.getMousePos(230, 100)
    //     this.criarAudio({
    //       posX: x,
    //       posY: y,
    //       initialWidth: 380,
    //       initialHeight: 100
    //     })
    //   } else if (e.ctrlKey && e.keyCode == 74) {
    //     const { x, y } = this.getMousePos(600, 500)
    //     this.criarVideo({
    //       posX: x,
    //       posY: y,
    //       initialWidth: 600,
    //       initialHeight: 500
    //     })
    //   } else if (e.ctrlKey && e.keyCode == 79) {
    //     const { x, y } = this.getMousePos(200, 100)
    //     this.criarGravadorAudio({
    //       posX: x,
    //       posY: y,
    //       initialWidth: 200,
    //       initialHeight: 100
    //     })
    //   }

    // }



    let length = options.blocos ? options.blocos.length : null

    if (length > 0) {
      options.blocos.forEach(bloco => {
        this.loadBloco(bloco)
      })
    }
  }
  load(blocos) {
    blocos.forEach(bloco => {
      this.loadBloco(bloco)
    })
  }
  loadBloco(bloco) {
    switch (bloco.type) {
      case "Texto":
        this.criarTexto(bloco)
        break
      case "Imagem":
        this.criarImagem(bloco)
        break
      case "Lista":
        this.criarLista(bloco)
        break
      case "Tabela":
        this.criarTabela(bloco)
        break
    }
  }

  export() {
    let exportBlocos = []
    this.blocos.forEach(bloco => {
      exportBlocos.push(bloco.export())
    })

    console.log("blocos", exportBlocos)

    return { name: this.navTab.text.textContent, exportBlocos }
  }

  removeWindowMouseMoveAction(ind) {
    this.windowOnMouseMoveActions.splice(ind, 1)
  }

  addWindowMouseMoveAction(action) {
    this.windowOnMouseMoveActions.push(action)
    window.onmousemove = e => {
      this.windowOnMouseMoveActions.forEach(action => {
        action(e)
      })
    }
    return this.windowOnMouseMoveActions.length - 1
  }

  countImgs() {
    let images = fs.readdirSync("./imgs")
    if (images.length > 0) {
      let imagesNumber = images.map(image => parseInt(image.split("-")[1]))
      this.imageCount = Math.max(...imagesNumber)
    } else {
      this.imageCount = 0
    }
  }

  criarTabela(options) {
    this.blocos.push(
      new Tabela({
        folhaContainer: this.folhaContainer,
        posX: `${options.posX}px`,
        posY: `${options.posY}px`,
        loadedFonts: this.loadedFonts,
        initialHeight: options.initialHeight || options.width,
        initialWidth: options.initialWidth || options.height,
        folha: this
      })
    )
  }

  criarLista(options) {
    this.blocos.push(
      new Lista({
        folhaContainer: this.folhaContainer,
        posX: `${options.posX}px`,
        posY: `${options.posY}px`,
        loadedFonts: this.loadedFonts,
        initialHeight: options.initialHeight || options.width,
        initialWidth: options.initialWidth || options.height,
        folha: this
      })
    )
  }

  criarTexto(options) {
    this.blocos.push(
      new Texto({
        folhaContainer: this.folhaContainer,
        posX: `${options.posX}px`,
        posY: `${options.posY}px`,
        loadedFonts: this.loadedFonts,
        initialHeight: options.initialHeight || options.height,
        initialWidth: options.initialWidth || options.width,
        folha: this,
        load: options
      })
    )
  }

  criarImagem(options) {
    this.blocos.push(
      new Imagem({
        folhaContainer: this.folhaContainer,
        posX: `${options.posX}px`,
        posY: `${options.posY}px`,
        initialHeight: options.initialHeight || options.width,
        initialWidth: options.initialWidth || options.height,
        src: options.src,
        folha: this
      })
    )
  }

  criarAudio(options) {
    this.blocos.push(
      new Audio({
        folhaContainer: this.folhaContainer,
        posX: `${options.posX}px`,
        posY: `${options.posY}px`,
        initialHeight: options.initialHeight || options.width,
        initialWidth: options.initialWidth || options.height,
        folha: this
      })
    )

  }
  criarVideo(options) {
    this.blocos.push(
      new Video({
        folhaContainer: this.folhaContainer,
        posX: `${options.posX}px`,
        posY: `${options.posY}px`,
        initialHeight: options.initialHeight || options.width,
        initialWidth: options.initialWidth || options.height,
        folha: this
      })
    )

  }
  criarGravadorAudio(options) {
    this.blocos.push(
      new GravadorAudio({
        folhaContainer: this.folhaContainer,
        posX: `${options.posX}px`,
        posY: `${options.posY}px`,
        initialHeight: options.initialHeight || options.width,
        initialWidth: options.initialWidth || options.height,
        folha: this
      })
    )

  }

  esconderBlocos() {
    for (let i = 0; i < this.blocos.length; i++) {
      while (this.blocos[i].folhaContainer.firstChild)
        this.blocos[i].folhaContainer.firstChild.remove()
    }
  }

  mostrarBlocos() {
    for (let i = 0; i < this.blocos.length; i++) {
      this.blocos[i].folhaContainer.appendChild(this.blocos[i].blocoRef)
    }
  }

  removeBloco(bloco) {
    let ind = this.blocos.findIndex(b => b.blocoRef == bloco.blocoRef)
    this.blocos.splice(ind, 1)
    console.log(this.blocos)
  }

  trazerFrente(bloco) {
    let ind
    let zindex = bloco.blocoRef.style.zIndex
    if (zindex + 1 != this.zIndexBlocoMax) zindex++
    this.blocos.forEach((bloc, index) => {
      if (bloc.blocoRef == bloco.blocoRef) {
        ind = index
      }
      let zIndex = bloc.blocoRef.style.zIndex
      if (zIndex - 1 != this.zIndexBlocoMin) {
        bloc.blocoRef.style.zIndex = zIndex - 1
      }
    })

    this.blocos[ind].blocoRef.style.zIndex = zindex
  }
}

module.exports = Folha
