const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth;
canvas.height = innerHeight

console.log(canvas);

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectiles {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

const canx = canvas.width / 2
const cany = canvas.height / 2

const player = new Player(canx, cany, 30, 'blue');
player.draw()

function animate() {
    requestAnimationFrame(animate)
    //c.clearRect(0, 0, innerWidth, innerHeight)
    //player.draw()
}

window.addEventListener('click', (e) => {
    const x = e.clientX
    const y = e.clientY

    const projectile = new Projectiles(canx, cany, 5, 'red', 5)
    projectile.draw()
    console.log("projectile");
})

animate()