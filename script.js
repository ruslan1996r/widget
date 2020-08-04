const buttonColor = document.currentScript.getAttribute('buttonColor'); // string
const position = document.currentScript.getAttribute('position');       // string
const domain = document.currentScript.getAttribute('domain');           // string
const svgIcon = document.currentScript.getAttribute('svgIcon');         // string

const chatWidget = document.createElement('div');   // HTMLElement
const buttonImage = document.createElement('img')   // HTMLElement
const [positionY, positionX] = position.split('-')  // Array<string>

let isMouseDown = false                                            // boolean
const buttonHeight = 60                                            // number
const chatHeight = innerWidth <= 768 ? (innerHeight - 50) : 400    // number
const chatWidth = innerWidth <= 768 ? innerWidth : 300             // number
const iframeWidth = innerWidth <= 768 ? '100%' : '300px'           // string
const iframeHeight = innerWidth <= 768 ? '100%' : '400px'          // string

const widgetTop = positionY === 'top' ? '0' : 'inherit'            // string
const widgetBottom = positionY === 'bottom' ? '0' : 'inherit'      // string
const widgetRight = positionX === 'right' ? '0' : 'inherit'        // string
const widgetLeft = positionX === 'left' ? '0' : 'inherit'          // string

const buttonTop = positionY === 'top' ? '0' : 'inherit'            // string
const buttonBottom = positionY === 'bottom' ? '0' : 'inherit'      // string
const buttomRight = positionX === 'right' ? '0' : 'inherit'        // string
const buttomLeft = positionX === 'left' ? '0' : 'inherit'          // string

buttonImage.src = svgIcon
buttonImage.title = 'Open chat'
buttonImage.onclick = () => onCloseButton(true)

function setButtonStyle({ showButton = 'inherit' }) {    // (string)=>
    buttonImage.style = `
        margin: 20px;
        display: ${showButton};
        height: ${buttonHeight}px;
        cursor: pointer;
        position: fixed;
        top: ${buttonTop};
        right: ${buttomRight};
        bottom: ${buttonBottom};
        left:${buttomLeft};
    `
}

chatWidget.innerHTML = `
    <div>
        <p
            title="Close chat"  
            onclick={onCloseButton(false)}
            style="cursor:pointer; 
                font-size: 20px; 
                padding: 10px; 
                width: 20px; 
                margin: 0px"
            >
                &#10006;
        </p>
    </div>
    <iframe 
        
        src=${domain}; 
        sandbox = "allow-same-origin allow-scripts allow-popups allow-forms"
        allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        width=${iframeWidth}; 
        height=${iframeHeight};
    >
        iframe не поддерживается
    </iframe>

`;
chatWidget.addEventListener('mousedown', () => {
    isMouseDown = true
})
chatWidget.addEventListener('mouseup', () => {
    isMouseDown = false
})
chatWidget.addEventListener('mousemove', (e) => {
    if (isMouseDown && (e.clientX) > (chatWidth / 2) &&
        (innerWidth - (chatWidth / 2) >= (e.clientX)) &&
        (innerHeight - (chatHeight)) >= (e.clientY + 25)) {
        setWidgetStyle({
            top: `${e.clientY - 25}px`,
            right: widgetRight,
            bottom: widgetBottom,
            left: `${e.clientX - 150}px`,
            showWidget: 'inherit'
        })
    }
})

function setWidgetStyle({
    top,         // string
    right,       // string 
    bottom,      // string 
    left,        // string 
    showWidget   // string 
}) {
    chatWidget.style = `
        display: ${showWidget};
        height: ${chatHeight + 50}px;
        width: ${chatWidth}px;
        top: ${top};
        right: ${right};
        bottom: ${bottom};
        left: ${left};
        position: fixed;
        cursor: move;
        `
}

function onCloseButton(showWidget) {    // (boolean)=>
    if (showWidget) {
        setWidgetStyle({
            top: widgetTop,
            right: widgetRight,
            bottom: widgetBottom,
            left: widgetLeft,
            showWidget: 'inherit'
        })
        setButtonStyle({ showButton: 'none' })
    } else {
        setWidgetStyle({ showWidget: 'none' })
        setButtonStyle({ showButton: 'inherit' })
    }
}

document.body.append(buttonImage)
document.body.append(chatWidget);
setWidgetStyle({
    top: widgetTop,
    right: widgetRight,
    bottom: widgetBottom,
    left: widgetLeft,
    showWidget: 'none'
})
setButtonStyle({ showButton: 'inherit' })

// false - закрыть окно чата; true - открыть окно чата; null - полностью скрыть виджет (окно чата и кнопку)
window.observer = {
    get state() {
        return window._state;
    },
    set setState(val) { // (boolean | null)=>
        window._state = val
        if (val === null) {
            chatWidget.style = "display:none"
            buttonImage.style = "display:none"
        } else {
            onCloseButton(window._state)
        }
        return window._state
    }
};