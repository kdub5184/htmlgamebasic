const canvas = document.querySelector('canvas')
canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
const c = canvas.getContext('2d')
//console.log(gsap)

canvas.width = innerWidth;
canvas.height = innerHeight

const scoreL = document.querySelector('#scoreL')
const startGameBtn = document.querySelector('#startGameBtn')
const startModal = document.querySelector('#startModal') 
const bigScore = document.querySelector('#bigScore')
//console.log(canvas);

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
        this.x = x
        this.y = y
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

const friction = 0.988

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.radius = radius
        this.x = x
        this.y = y
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw ()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.01
    }
}

const canvasx = canvas.width / 2
const canvasy = canvas.height / 2

let player = new Player(canvasx, canvasy, 15, 'white');


let projectiles = []
let enemies = []
let particles = []
let score = 0

function init(){
    player = new Player(canvasx, canvasy, 15, 'white');
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreL.innerHTML = score

}

//********************************** Generate Enemies ********************************** */
function spawnEnenies() {
    setInterval (() => {

        this.radius = Math.random() * 30 + 7
        let x, y
        if(Math.random() > 0.5) {
            x = Math.random() < 0.5 ? 0-this.radius : canvas.width + this.radius
            y = Math.random() * canvas.height
        }else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0-this.radius : canvas.height + this.radius
        }
        const color = 'hsl(' + Math.random() * 360 + ', 100%, 50%, 1)'

        const angle = Math.atan2(canvasy - y, canvasx - x)

        const velocity = { 
            x: Math.cos(angle), 
            y: Math.sin(angle) 
        }

        enemies.push(new Enemy(x, y, this.radius, color, velocity))
        //console.log('enemy ' + enemies);
    }, 1000)
        
}

//********************************MAIN GAME LOOP ********************************** */
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)

    c.fillStyle = 'rgba(0, 0, 0, 0.09)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    //c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()


    particles.forEach(particle => {
        if (particle.alpha <= 0) {
            particles.splice(particles.indexOf(particle), 1)
        }
        particle.update()
    })

    projectiles.forEach(projectile => {
        projectile.update()

        //if projectile is offscreen remove it
        if(projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
            projectiles.splice(projectiles.indexOf(projectile), 1)
        }
    })

    enemies.forEach(enemy => {
        enemy.update()
    })

    //Check for collsions of all projectiles with all enemies and add point to score
    enemies.forEach(enemy => {
        projectiles.forEach(projectile => {
            if(Math.sqrt(Math.pow(enemy.x - projectile.x, 2) + Math.pow(enemy.y - projectile.y, 2)) < enemy.radius + projectile.radius) {

                //add 100 to score and update scoreL update front end
                score += 100
                scoreL.innerHTML = score

                //create projectiles explosion
                for(let i = 0; i < enemy.radius; i++) {
                    particles.push(
                        new Particle(
                            projectile.x, 
                            projectile.y, 
                            Math.random() * 3 + 1, enemy.color, 
                            {
                                x: (Math.random() - 0.5)*(Math.random()*6), 
                                y: (Math.random() - 0.5) *(Math.random()*6)
                            }
                        )
                    )
                }

                //if enemy's radius is bigger than 10 shrink enemy, if smaller than 7 remove enemy
                if(enemy.radius - 10 > 10) {
                    projectiles.splice(projectiles.indexOf(projectile), 1)
                    
                    gsap.to(enemy, {radius: enemy.radius - 10})
                    if (enemy.radius < 7) {
                        enemies.splice(enemies.indexOf(enemy), 1)
                    }
                    
                }else {
                enemies.splice(enemies.indexOf(enemy), 1)
                projectiles.splice(projectiles.indexOf(projectile), 1)
                }
            }
        })
    })

    //Detect if player is hit by enemy, 
    enemies.forEach(enemy => {
        if(Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2)) < enemy.radius + player.radius) {
            
            //cancel all animations and reset game
            cancelAnimationFrame(animationId)
            startModal.style.display = 'flex'
            bigScore.innerHTML = score
        }
    })
    

}

window.addEventListener('click', (e) => {
    const x = e.clientX
    const y = e.clientY

    const angle = Math.atan2(y - canvasy, x - canvasx)
    const velocity = {
        x: Math.cos(angle) * 4.5, // * 10,
        y: Math.sin(angle) * 4.5//* 10
    }
    projectiles.push(new Projectiles(canvasx, canvasy, 5, 'white', velocity))

    console.log("projectile" + projectiles.length);
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
spawnEnenies()
startModal.style.display = 'none'
})