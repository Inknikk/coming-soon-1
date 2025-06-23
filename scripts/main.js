    // Particle System
        window.addEventListener('load', init);
        window.addEventListener('resize', resize);
        
        var particles = [];
        var particleCount = 150;
        var canvas = null;
        var context = null;
        var gradient = null;
        
        // More sophisticated color palette
        var palettes = [
            ['#00F0B5CC', '#7237BDCC', '#FF3E9DCC', '#0CF2E7CC'],
            ['#7B2CBFCC', '#E0AAFFCC', '#9D4EDDCC', '#C77DFFCC'],
            ['#4361EECC', '#3A0CA3CC', '#7209B7CC', '#F72585CC'],
            ['#2B2D42CC', '#8D99AECC', '#EF233CCC', '#D90429CC']
        ];
        
        var currentPalette = palettes[0];
        var paletteChangeInterval = 15000; // 15 seconds
        
        function init() {
            canvas = document.getElementById('animation-surface');
            context = canvas.getContext('2d');
            
            // Create particles with more organic properties
            for (var i = 0; i < particleCount; i++) {
                var randomColourIndex = Math.round((currentPalette.length - 1) * Math.random());
                var speed = 1 + Math.random() * 5;
                var angle = Math.PI * 2 * Math.random();
                
                var particle = {
                    x: canvas.width * Math.random(),
                    y: canvas.height * Math.random(),
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: 5 + 20 * Math.random(),
                    colour: currentPalette[randomColourIndex],
                    originalColour: currentPalette[randomColourIndex],
                    life: 100 + Math.random() * 500,
                    maxLife: 100 + Math.random() * 500,
                    opacity: 0.3 + Math.random() * 0.7,
                    blur: 5 + Math.random() * 15
                };
                
                particles.push(particle);
            }
            
            // Change palette periodically
            setInterval(changePalette, paletteChangeInterval);
            
            resize();
            update();
            
            // Initialize countdown
            initializeCountdown();
        }
        
        function changePalette() {
            var newPaletteIndex = Math.floor(Math.random() * palettes.length);
            currentPalette = palettes[newPaletteIndex];
            
            // Update all particles with new colors
            particles.forEach(particle => {
                var randomColourIndex = Math.round((currentPalette.length - 1) * Math.random());
                particle.originalColour = currentPalette[randomColourIndex];
            });
        }
        
        function update() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create a subtle gradient overlay for depth
            var overlayGradient = context.createRadialGradient(
                canvas.width * 0.5, canvas.height * 0.5, 0,
                canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.5
            );
            overlayGradient.addColorStop(0, 'rgba(10, 10, 26, 0)');
            overlayGradient.addColorStop(1, 'rgba(10, 10, 26, 0.8)');
            
            // Draw particles with more organic behavior
            for (var i = 0; i < particles.length; i++) {
                var particle = particles[i];
                
                // Organic movement with slight acceleration
                particle.vx += (Math.random() - 0.5) * 0.1;
                particle.vy += (Math.random() - 0.5) * 0.1;
                
                // Apply friction
                particle.vx *= 0.99;
                particle.vy *= 0.99;
                
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Life cycle management
                particle.life--;
                if (particle.life <= 0) {
                    // Reset particle
                    particle.x = canvas.width * Math.random();
                    particle.y = canvas.height * Math.random();
                    var speed = 1 + Math.random() * 5;
                    var angle = Math.PI * 2 * Math.random();
                    particle.vx = Math.cos(angle) * speed;
                    particle.vy = Math.sin(angle) * speed;
                    particle.life = 100 + Math.random() * 500;
                    particle.maxLife = particle.life;
                    var randomColourIndex = Math.round((currentPalette.length - 1) * Math.random());
                    particle.originalColour = currentPalette[randomColourIndex];
                }
                
                // Calculate opacity based on life
                particle.opacity = 0.3 + 0.7 * (particle.life / particle.maxLife);
                
                drawParticle(context, particle);
            }
            
            // Apply radial gradient overlay for depth
            context.save();
            context.globalCompositeOperation = 'overlay';
            context.fillStyle = overlayGradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.restore();
            
            requestAnimationFrame(update);
        }
        
        function drawParticle(context, particle) {
            // Create glow effect
            var gradient = context.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 1.5
            );
            gradient.addColorStop(0, particle.originalColour);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            context.save();
            context.globalAlpha = particle.opacity;
            
            // Draw glow
            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
            context.fillStyle = gradient;
            context.fill();
            
            // Draw core particle
            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius * 0.6, 0, Math.PI * 2);
            context.fillStyle = particle.originalColour;
            context.fill();
            
            context.restore();
        }
        
        function resize() {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                // Update gradient
                gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, 'rgba(0, 144, 142, 0.1)');
                gradient.addColorStop(1, 'rgba(162, 0, 141, 0.1)');
            }
        }
        
        // Countdown functionality
        function initializeCountdown() {
            // Set the date we're counting down to (7 days from now)
            var countDownDate = new Date();
            countDownDate.setDate(countDownDate.getDate() + 7);
            
            // Update the countdown every 1 second
            var x = setInterval(function() {
                // Get today's date and time
                var now = new Date().getTime();
                
                // Find the distance between now and the countdown date
                var distance = countDownDate - now;
                
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                // Display the result
                document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
                document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
                document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
                document.getElementById("seconds").innerHTML = Math.floor(seconds).toString().padStart(2, '0');
                
                // If the countdown is finished, reset it
                if (distance < 0) {
                    clearInterval(x);
                    countDownDate = new Date();
                    countDownDate.setDate(countDownDate.getDate() + 7);
                }
            }, 1000);
        }