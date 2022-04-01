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

    update() {
        this.draw ()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.radius = radius
        this.x = Math.random() < 0.5 ? -radius : innerWidth + radius
        this.y = Math.random() < 0.5 ? -radius : innerHeight + radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw ()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

const canvasx = canvas.width / 2
const canvasy = canvas.height / 2

const player = new Player(canvasx, canvasy, 30, 'blue');


const projectiles = []
const enemies = []

function spawnEnenies() {
    setInterval (() => {
        enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * canvas.height, 30, 'green', {x: Math.random() * 10 - 5, y: Math.random() * 10 - 5}))
        console.log('enemy');
    }, 800)
        
}

//********************************MAIN GAME LOOP ********************************** */
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach(projectile => {
        projectile.update()
    })
    enemies.forEach(enemy => {
        enemy.update()
    })
}

window.addEventListener('click', (e) => {
    const x = e.clientX
    const y = e.clientY

    const angle = Math.atan2(y - canvasy, x - canvasx)
    const velocity = {
        x: Math.cos(angle), // * 10,
        y: Math.sin(angle) //* 10
    }
    projectiles.push(new Projectiles(canvasx, canvasy, 5, 'red', velocity))

    console.log("projectile");
})

animate()
spawnEnenies()