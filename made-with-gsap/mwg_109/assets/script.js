window.addEventListener("DOMContentLoaded", () => {
	
    const root = document.querySelector('.mwg_effect109')
	const container = root.querySelector('.container')
    const slides = [...container.querySelectorAll('.slide')]
    
    const contents = slides.map(item => item.querySelector('.content'))
    const smallTitles = slides.map(item => item.querySelector('.small-title'))
    const bottoms = slides.map(item => item.querySelector('.bottom'))

    let widthOpen = Math.min(736, window.innerWidth * 0.66)
    let widthClosed = 88
    let borderRadiusClosed = 44
    let heightClosed = 400
    let heightHover = 420
    let smallTitleXOpen = 60
    let contentXLeft = -720
    let contentXRight = 70
    let axis = 'x'

    const mm = gsap.matchMedia()
    mm.add('(max-width: 991px)', () => {
        widthOpen = 636
        widthClosed = 74
        contentXLeft = -620
        heightClosed = '100%'
        heightHover = '100%'
        axis = 'y'
    })
    mm.add('(max-width: 767px)', () => {
        widthOpen = 536
        contentXLeft = -520
    })

    // INITIAL STATE
    let lastIndexEntered = 0
    slides[0].classList.add('on')

    gsap.set(slides[0], {
        flex: '0 0 ' + widthOpen + 'px',
    })
    gsap.set(slides.slice(1), {
        borderRadius: borderRadiusClosed,
        height: heightClosed,
    })
    gsap.set(smallTitles[0], {
        [axis]: smallTitleXOpen
    })
    gsap.set(smallTitles.slice(1), {
        width: heightClosed,
    })
    gsap.set(contents.slice(1), {
        [axis]: contentXLeft
    })
    gsap.set(bottoms.slice(1), {
        autoAlpha: 0
    })

    // HANDLERS
    function handleMouseEnter(item, index) {
        if (item.classList.contains('on')) return

        gsap.to(item, {
            height: heightHover,
            duration: 0.3,
            ease: 'back.out(2)',
        })
        gsap.to(smallTitles[index], {
            width: heightHover,
            duration: 0.3,
            ease: 'back.out(2)',
        })
    }

    function handleMouseLeave(item, index) {
        if (item.classList.contains('on')) return

        gsap.to(item, {
            height: heightClosed,
            duration: 0.3,
            ease: 'back.out(2)',
        })
        gsap.to(smallTitles[index], {
            width: heightClosed,
            duration: 0.3,
            ease: 'back.out(2)',
        })
    }

    function handleMouseClick(item, index) {
        const isBefore = index < lastIndexEntered

        if (index !== lastIndexEntered) {
            slides.forEach(slide => slide.classList.remove('on'))
            gsap.to(slides, {
                flex: '0 0 ' + widthClosed + 'px',
                height: heightClosed,
                borderRadius: borderRadiusClosed,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(contents[lastIndexEntered], {
                [axis]: isBefore ? contentXLeft : contentXRight,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(smallTitles, {
                [axis]: 0,
                width: heightClosed,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(bottoms, {
                autoAlpha: 0,
                duration: 0.4,
                ease: 'power1.inOut',
            })

            item.classList.add('on')
            gsap.to(item, {
                flex: '0 0 ' + widthOpen + 'px',
                borderRadius: 20,
                height: 506,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.fromTo(contents[index], {
                [axis]: isBefore ? contentXRight : contentXLeft,
            }, {
                [axis]: 0,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(smallTitles[index], {
                [axis]: isBefore ? -704 : smallTitleXOpen,
                ...(axis === 'x' && { width: 506 }),
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(bottoms[index], {
                autoAlpha: 1,
                delay: axis === 'y' ? 0.4 : 0,
                duration: 0.4,
                ease: 'power1.inOut',
            })
        }

        lastIndexEntered = index
    }
    
    slides.forEach((item, index) => {
        const onEnter = () => handleMouseEnter(item, index)
        const onLeave = () => handleMouseLeave(item, index)
        const onClick = () => handleMouseClick(item, index)

        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)
        item.addEventListener('click', onClick)
        item.mouseEnterListener = onEnter
        item.mouseLeaveListener = onLeave
        item.mouseClickListener = onClick
    })

    // KILL
    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation => 
            mutation.type === 'childList' && 
            Array.from(mutation.removedNodes).includes(root)
        )
        
        if (isRootRemoved) {
            mm.revert()
            slides.forEach(item => {
                item.removeEventListener('mouseenter', item.mouseEnterListener);
                item.removeEventListener('mouseleave', item.mouseLeaveListener);
                item.removeEventListener('click', item.mouseClickListener);
            });
            observer.disconnect()
        }
    })
    observer.observe(document.body, {childList: true, subtree: true})
})