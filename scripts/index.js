//jshint esversion:6
// portfolio concerns
const portfolioTabs = Array.from(document.querySelectorAll('[data-tab]'));
const [portfolioContainer] = document.getElementsByClassName("portfolio-items-container");
const portfolioItems = document.getElementById('portfolio-canvas-container');
const portfolioItemsClone = portfolioItems.cloneNode();
const portfolioRightButton = document.getElementById("portfolio-right-arrow");
const portfolioLeftButton = document.getElementById("portfolio-left-arrow");
const PORTFOLIO_ITEM_RIGHT_MARGIN = 20;
const BANNER_SLIDE_INTERVAL = 10000;
const BANNER_TRANSITION_INTERVAL = 2000;
const MOBILE_BREAKPOINT = 420;

// sample data.
const projectList = [
    [6, 1],
    [2, 3],
    [4, 5]
];
const bannerData = [{
        large_text: "Creativity at its Peak",
        small_text: "At The Elite Creative Design, we garnish all our work with a touch of creativity and class.",
        button_text: "our services",
        button_url: "/services.html",
        image_url: "./assets/home1.png",

    },
    {
        large_text: "Home Beauty is not a Feat",
        small_text: "We see home beautification as a way of life at The Elite creative Design. To us it is not a feat but a standard.",
        button_text: "our firm",
        button_url: "/about.html",
        image_url: "./assets/home2.png"
    }
];

// on load
window.onload = function() {
    let bannerIndex = 0;
    let previousBannerIndex = 0;
    let portfolioIndex = 0;
    let tabIndex = 0;

    // -------------------
    // event listeners.
    // -------------------
    portfolioLeftButton.onclick = function(e) {
        movePortfolio('left');
    }
    portfolioRightButton.onclick = function(e) {
        movePortfolio('right');
    }
    portfolioTabs.forEach(tab => {
        tab.onclick = function(e) {
            const target = e.target;
            portfolioTabs[tabIndex].classList.remove('selected');
            target.classList.add('selected');
            tabIndex = target.dataset.index;

            // clear the project list and then update with new canvases.
            portfolioContainer.replaceChild(portfolioItemsClone.cloneNode(), portfolioItems);
            setupPortfolioEnvironment(projectList);
        }
    })


    // ----------
    // banner.
    // ----------
    // setup the indicators first
    setupBannerControls();

    // pop in the first banner.
    updateBanner(bannerData[bannerIndex]);

    // animation loop!!
    setInterval(() => {
        previousBannerIndex = bannerIndex;

        if (bannerIndex === bannerData.length - 1) {
            bannerIndex = 0;
        } else {
            ++bannerIndex;
        }

        updateBanner(bannerData[bannerIndex]);
    }, BANNER_SLIDE_INTERVAL);



    // ----------------------
    // projects portfolio.
    // ----------------------
    // this sets up the canvas for current selected tab.
    setupPortfolioEnvironment(projectList);



    // -------------
    // functions.
    // -------------
    function movePortfolio(direction) {
        const portfolioItems = document.getElementById('portfolio-canvas-container');

        const childrenLength = portfolioItems.children.length;
        const width = Array.from(portfolioItems.children)[0].width;

        if (
            (portfolioIndex === childrenLength - 1 && direction === 'right') ||
            (portfolioIndex === 0 && direction === 'left')
        ) {
            return;
        }

        direction === 'right' ? ++portfolioIndex : --portfolioIndex;
        portfolioItems.scrollLeft = portfolioIndex * (width + PORTFOLIO_ITEM_RIGHT_MARGIN);
    }

    function changeBannerIndicator(event) {
        const element = event.target;
        const position = element.dataset.id;
        previousBannerIndex = bannerIndex;
        bannerIndex = position;
        updateBanner(bannerData[position]);
    }

    function updateBanner(bannerOptions) {
        const TIME_TO_ZOOM = BANNER_SLIDE_INTERVAL - BANNER_TRANSITION_INTERVAL;
        const bannerLargeText = document.getElementById("banner-large-text");
        const bannerSmallText = document.getElementById("banner-small-text");
        const bannerButtonLink = document.getElementById("banner-button-link");
        const bannerImage = document.getElementById("banner-image");
        const { large_text, small_text, button_text, button_url, image_url } = bannerOptions;

        updateControls();

        bannerLargeText.innerHTML = large_text;
        bannerSmallText.innerHTML = small_text;
        bannerButtonLink.innerHTML = button_text;
        bannerButtonLink.setAttribute('href', button_url);
        bannerImage.style.background = `no-repeat center/100% 100% url(${image_url})`;
        setTimeout(() => {
            bannerImage.style.backgroundSize = "110% 110%";
        }, TIME_TO_ZOOM);
    }

    function setupBannerControls() {
        const slideControls = document.getElementById("slide-controls");

        for (let x = 0; x < bannerData.length; x++) {
            const indicator = document.createElement('div');

            indicator.dataset.id = x;
            indicator.classList.add("slide-indicator");
            if (x === bannerIndex) {
                indicator.classList.add("selected");
            }

            indicator.onclick = changeBannerIndicator;
            slideControls.append(indicator);
        }
    }

    function updateControls() {
        document.querySelector(`[data-id="${previousBannerIndex}"]`).classList.remove('selected');
        document.querySelector(`[data-id="${bannerIndex}"]`).classList.add('selected');
    }

    function setupCanvas(canvasNode, images, index) {
        const canvas = canvasNode.getContext('2d');
        let currentX = canvasNode.width / 2;
        let isDraggable = false;
        const [firstImg, secondImg] = images;

        const draw = setupImageDrawing(canvas);

        // these are just placeholder
        // real data would be gotten from somewhere else.
        // and passed through the "images" argument.
        const myImage = new Image();
        myImage.src = `./assets/${firstImg}.jpg`;
        myImage.onload = function() {
            drawRight(draw, myImage);
        }

        const myImage2 = new Image();
        myImage2.src = `./assets/${secondImg}.jpg`;
        myImage2.onload = function() {
            drawLeft(draw, myImage2);
        }

        canvasNode.onmousedown = function(e) {
            const { x } = getCursorPosition(canvasNode, e);
            if (x <= (currentX + 20) && x >= (currentX - 20)) {
                isDraggable = true;
            }
        };

        canvasNode.onmouseup = function(e) {
            isDraggable = false;
        };

        canvasNode.onmouseout = function(e) {
            isDraggable = false;
        };

        canvasNode.onmousemove = function(e) {
            const { x } = getCursorPosition(canvasNode, e);

            if (isDraggable && x <= myImage2.width &&
                (x >= (canvasNode.width - myImage.width))
            ) {
                currentX = x;
            }
        };

        canvasNode.ontouchstart = function(e) {
            e.preventDefault();
            console.log(e)
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvasNode.dispatchEvent(mouseEvent);
        }

        canvasNode.ontouchend = function(e) {
            e.preventDefault();
            const mouseEvent = new MouseEvent("mouseup", {});
            canvasNode.dispatchEvent(mouseEvent);
        }

        canvasNode.ontouchmove = function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvasNode.dispatchEvent(mouseEvent);
        }

        setInterval(() => {
            resetCanvas(canvas);

            drawRight(draw, myImage);
            drawLeft(draw, myImage2);

            drawLine(canvas);
            drawText(canvas, 'BEFORE', 15);
            drawText(canvas, 'AFTER', canvasNode.width - 60);
        }, 30);

        /* ----- */
        /* utils */
        /* ----- */
        function drawLine(canvas) {
            canvas.strokeStyle = '#C8933B';
            canvas.lineWidth = 10;

            canvas.beginPath();
            canvas.moveTo(currentX, 0);
            canvas.lineTo(
                currentX,
                (canvasNode.height / 2) - 20
            );
            canvas.stroke();

            canvas.beginPath();
            canvas.moveTo(currentX - 10, (canvasNode.height / 2) - 10)
            canvas.lineTo(
                currentX - 20,
                (canvasNode.height / 2)
            )
            canvas.lineTo(
                currentX - 10,
                (canvasNode.height / 2 + 10)
            );
            canvas.stroke();

            canvas.beginPath();
            canvas.moveTo(currentX + 10, (canvasNode.height / 2) - 10)
            canvas.lineTo(
                currentX + 20,
                (canvasNode.height / 2)
            )
            canvas.lineTo(
                currentX + 10,
                (canvasNode.height / 2 + 10)
            );
            canvas.stroke();


            canvas.beginPath();
            canvas.moveTo(currentX, (canvasNode.height / 2) + 20)
            canvas.lineTo(currentX, canvasNode.height);
            canvas.stroke();
        }

        function drawImage(canvas, image, ...args) {
            canvas.drawImage(image, ...args);
            image.style.display = 'block';
        }

        function drawText(canvas, text, x) {
            canvas.font = '20px "Roboto Condensed"';
            canvas.fillStyle = "white";
            canvas.fillText(text, x, 30);
        }

        function resetCanvas(canvas) {
            canvas.fillStyle = '#fff';
            canvas.fillRect(0, 0, canvasNode.width, canvasNode.height);
        }

        // ratio takes two bases and stores them,
        // and returns a function that returns the
        // equivalent value of one variable with respect
        // to the ratio.
        function ratio(base1, base2) {
            const _table = [base1, base2];
            return function(base, value) {
                return Number.parseFloat((value / _table[base]) * _table[base === 0 ? 1 : 0])
            }
        }

        function drawLeft(draw, image) {
            const scale = ratio(canvasNode.width, image.width);

            draw(
                'before', image,
                0, 0, scale(0, currentX) + 5, image.height,
                0, 0, currentX + 5, canvasNode.height
            );
        }

        function drawRight(draw, image) {
            const scale = ratio(canvasNode.width, image.width);

            draw(
                'after', image,
                image.width - scale(0, canvasNode.width - currentX), 0, scale(0, canvasNode.width - currentX), image.height,
                currentX, 0, canvasNode.width - currentX, canvasNode.height
            );
        }

        function setupImageDrawing(canvas) {
            const images = {
                before: { image: null, attr: [] },
                after: { image: null, attr: [] }
            };

            return function(type, image, ...args) {
                images[type].image = image;
                images[type].attr = args;
                if (!images.before.image || !images.after.image) {
                    return;
                }

                const { before, after } = images;
                drawImage(canvas, before.image, ...before.attr);
                drawImage(canvas, after.image, ...after.attr);
            }
        }

        function getCursorPosition(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
    }

    function setupPortfolioEnvironment(projects) {
        const portfolioItems = document.getElementById('portfolio-canvas-container');
        portfolioIndex = 0;
        const canvasWidth = isMobile(window) ? portfolioItems.offsetWidth : 500;
        const canvasHeight = isMobile(window) ? 400 : 550;

        projects.forEach(function(images, index) {
            const newCanvas = document.createElement('canvas');
            newCanvas.setAttribute('height', `${canvasHeight}px`);
            newCanvas.setAttribute('width', `${canvasWidth}px`);
            newCanvas.classList.add("portfolio-item");

            setupCanvas(newCanvas, images, index);

            portfolioItems.append(newCanvas);
        });
    }

    function isMobile(source) {
        return source.outerWidth <= MOBILE_BREAKPOINT;
    }
}