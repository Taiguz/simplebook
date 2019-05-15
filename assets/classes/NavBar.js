const Estilo = require("./Estilo")
const Botao = require("./Botao")
const NavTabs = require("./NavTabs")
const Dashboard = require("./Dashboard")

class NavBar extends Estilo {
  constructor() {
    super()
    this.bodyRef = document.getElementsByTagName("BODY")[0]
    this.criar()
    this.limiteAbas = 10
    this.moreModalAberto = false
    this.dashBook = new Dashboard({
      bodyRef: this.bodyRef,
      dashType: "caderno"
    })
    this.dashBag = new Dashboard({
      bodyRef: this.bodyRef,
      dashType: "mochila"
    })
    this.dashBlock = new Dashboard({
      bodyRef: this.bodyRef,
      dashType: "blocos"
    })
    this.dashs = [this.dashBook, this.dashBag, this.dashBlock]
  }
  criar() {
    this.ref = document.createElement("nav")
    this.addEstilo(this.ref, {
      position: "fixed",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      zIndex: "2",
      borderBottom: "9px solid var(--cor-clara)"
    })

    // More Nav Tabs
    this.moreNavTabs = document.createElement("more")

    this.addEstilo(this.moreNavTabs, {
      display: "none",
      position: "absolute",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "column",
      padding: "10px",
      top: "6vh",
      right: "20vw",
      borderRadius: "8px",
      overflowY: "auto",
      maxHeight: "450px",
      backgroundColor: "var(--cor-escura)"
    })

    this.bodyRef.appendChild(this.moreNavTabs)
    //
    const tabs = document.createElement("div")

    const buttons = document.createElement("div")

    const tabsContainer = document.createElement("div")

    const plusContainer = document.createElement("div")

    //Botao More
    this.moreButton = new Botao({
      icon: "drop",
      width: "100px",
      height: "70%",
      text: "Mais um",
      imageWidth: "12px",
      imageHeight: "12px",
      ref: plusContainer,
      style: {
        display: "none",
        marginLeft: "10px",
        marginBottom: "5px",
        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: "8px",
        backgroundColor: "var(--cor-media)"
      },
      action: () => this.abrirMoreModal()
    })

    //

    this.addEstilo(tabsContainer, {
      maxWidth: "90%",
      height: "100%",
      display: "flex",
      paddingLeft: "10px",
      alignItems: "flex-end"
    })

    this.addEstilo(plusContainer, {
      width: "10%",
      height: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end"
    })

    this.addEstilo(tabs, {
      width: "80%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start"
    })
    this.addEstilo(buttons, {
      width: "20%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around"
    })
    const botao1 = new Botao({
      icon: "hamburger",
      width: "10%",
      height: "60%",
      ref: buttons,
      action: () => {
        this.openDash(this.dashBlock)
      }
    })
    const botao2 = new Botao({
      icon: "hamburger",
      width: "10%",
      height: "60%",
      ref: buttons,
      action: () => {
        this.openDash(this.dashBook)
      }
    })
    const botao3 = new Botao({
      icon: "hamburger",
      width: "10%",
      height: "60%",
      ref: buttons,
      action: () => {
        this.openDash(this.dashBag)
      }
    })
    this.addEstilo(this.ref, {
      display: "flex"
    })
    this.tabs = []
    this.tabs.push(
      new NavTabs({ text: "Folha 1", ref: tabsContainer, tabs: this.tabs })
    )
    this.tabs.push(
      new NavTabs({ text: "Folha 2", ref: tabsContainer, tabs: this.tabs })
    )
    const tabsElements = this.tabs.map(tab => tab.ref)
    tabsContainer.append(...tabsElements)
    const novaAba = new Botao({
      icon: "plus",
      width: "30px",
      height: "30px",
      imageWidth: "12px",
      imageHeight: "12px",
      ref: plusContainer,
      action: () => this.novaAba(tabsContainer, this.moreNavTabs),
      style: {
        borderRadius: "50%",
        backgroundColor: "var(--cor-media)",
        marginLeft: "10px",
        marginBottom: "5px",
        flexShrink: 0
      }
    })
    tabs.append(tabsContainer, plusContainer)
    novaAba.hover(novaAba.ref, { backgroundColor: "var(--cor-clara)" })
    this.ref.append(tabs, buttons)
    this.bodyRef.appendChild(this.ref)
  }

  abrirMoreButton() {
    if (this.moreButton.ref.style.display != "flex") {
      this.moreButton.text.style.display = "none"
      this.addEstilo(this.moreButton.ref, { display: "flex" })
      let anim = this.moreButton.ref.animate(
        [{ width: "0px", opacity: 0 }, { width: "80px", opacity: 1 }],
        200
      )
      anim.onfinish = () =>
        this.addEstilo(this.moreButton.text, { display: "flex" })
    }
  }

  fecharMoreButton() {
    console.log(this.tabs.length)
    if (this.tabs.length <= this.limiteAbas) {
      if (this.moreButton.ref.style.display != "none") {
        let anim = this.moreButton.ref.animate(
          [{ width: "80px", opacity: 1 }, { width: "0px", opacity: 0 }],
          200
        )
        this.addEstilo(this.moreButton.ref, { display: "none" })
        this.abrirMoreModal()
      }
    }
  }

  abrirMoreModal() {
    if (this.moreModalAberto) {
      let anim = this.moreNavTabs.animate(
        [{ opacity: "1" }, { opacity: "0" }],
        100
      )
      anim.onfinish = () => {
        this.addEstilo(this.moreNavTabs, { display: "none" })
        this.moreModalAberto = false
      }
    } else {
      this.addEstilo(this.moreNavTabs, { display: "flex" })
      let anim = this.moreNavTabs.animate(
        [{ top: "4vh", opacity: "0" }, { top: "6vh", opacity: "1" }],
        100
      )
      anim.onfinish = () => (this.moreModalAberto = true)
    }
  }

  atualizarNumAbas() {
    this.moreButton.text.textContent = `${this.tabs.length -
      this.limiteAbas} mais`
  }

  novaAba(tabsContainer, moreContainer) {
    if (this.tabs.length >= this.limiteAbas) {
      this.abrirMoreButton()
      this.tabs.push(
        new NavTabs({
          text: "Folha 1",
          ref: moreContainer,
          tabs: this.tabs,
          moreTabs: true,
          navbar: this,
          index: this.tabs.length + 1
        })
      )
      console.log(this.tabs)
      this.atualizarNumAbas()
    } else {
      this.tabs.push(
        new NavTabs({
          text: "Folha 1",
          ref: tabsContainer,
          moreTabsRef: moreContainer,
          tabs: this.tabs,
          navbar: this,
          index: this.tabs.length + 1
        })
      )
      console.log(this.tabs)
    }
  }

  openDash(targetDash) {
    if (!targetDash.isOpened()) {
      this.dashs.forEach(dash => {
        if (dash.ref != targetDash) {
          if (dash.isOpened()) dash.openDash()
        }
      })
      targetDash.openDash()
    }
  }
}

const navBar = new NavBar()