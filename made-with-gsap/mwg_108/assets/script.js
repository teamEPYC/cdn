window.addEventListener("DOMContentLoaded", () => {

	/* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LENIS SMOOTH SCROLL (OPTIONAL) */
	
    const root = document.querySelector('.mwg_effect108')
	const list = root.querySelector('ul')
    const mediasContainer = root.querySelector('.medias')
    const medias = [...root.querySelectorAll('.media')]

    const lines = [...root.querySelectorAll('li')].map((item, index) => ({
        item,
        title: item.querySelector('span'),
        index
    }))
    const heightItem = lines[0].title.offsetHeight
    const half = medias.length / 2

    const FADE = { duration: 0.2, ease: 'power1.inOut' }
    const LEFT_INNER = [8, 7, 6, 5, 4]
    const RIGHT_INNER = [5, 4, 3, 2, 1]

    let zIndex = 0
    let currentZone = 2
    let currentIndex = -1
    let mediasActive = false
    const hiddenState = new Array(medias.length).fill(false)

    function getActiveTitle() {
        return lines[currentIndex]?.title ?? null
    }

    function computePositions(title) {
        const rootRect = root.getBoundingClientRect()
        const titleRect = title.getBoundingClientRect()
        const mediaSize = medias[0].offsetWidth
        const gap = window.innerWidth * 0.015
        const leftInner = LEFT_INNER[currentZone]
        const rightInner = RIGHT_INNER[currentZone]
        const y = titleRect.top - rootRect.top + titleRect.height / 2 - mediaSize / 2

        const slots = medias.map((media, i) => {
            if (i < half) {
                const num = i + 1
                const slot = -(leftInner - num + 1)
                return {
                    x: (titleRect.left - rootRect.left) + slot * (mediaSize + gap),
                    hidden: num > leftInner
                }
            }

            const num = i - half + 1
            const slot = num - rightInner + 1
            return {
                x: (titleRect.right - rootRect.left) + gap + (slot - 1) * (mediaSize + gap),
                hidden: num < rightInner
            }
        })

        return { slots, y }
    }

    function placeMedias(title, isLineChange) {
        const { slots, y } = computePositions(title)

        medias.forEach((media, i) => {
            const slot = slots[i]
            const duration = isLineChange ? Math.random() / 3 + 0.2 : 0.3
            const isAppearing = !slot.hidden && hiddenState[i] && !isLineChange

            if (slot.hidden) {
                gsap.to(media, {
                    scale: 0,
                    autoAlpha: 0,
                    duration: isLineChange ? duration : FADE.duration,
                    ease: isLineChange ? 'back.out(1)' : FADE.ease,
                    overwrite: 'auto',
                    ...(isLineChange && { x: slot.x, y })
                })
            } else if (isAppearing) {
                gsap.set(media, { x: slot.x, y, overwrite: true })
                gsap.to(media, { scale: 1, autoAlpha: 1, ...FADE, overwrite: true })
            } else {
                gsap.to(media, {
                    x: slot.x,
                    y,
                    scale: 1,
                    duration,
                    ease: 'back.out(1)',
                    overwrite: 'auto'
                })
                if (mediasActive) gsap.to(media, { autoAlpha: 1, ...FADE })
            }

            hiddenState[i] = slot.hidden
        })
    }

    function showMediasContainer() {
        mediasActive = true
        gsap.to(mediasContainer, { ...FADE, autoAlpha: 1 })
    }

    function hideMediasContainer() {
        mediasActive = false
        gsap.to(mediasContainer, { ...FADE, autoAlpha: 0 })
    }

    function revealMedias(index) {
        const title = lines[index].title
        currentIndex = index
        showMediasContainer()

        zIndex++
        const activeImgs = root.querySelectorAll('.media img:nth-child(' + (index + 1) + ')')
        gsap.fromTo(activeImgs, {
            autoAlpha: 0,
            zIndex: zIndex
        }, {
            autoAlpha: 1,
            ...FADE,
            onComplete: () => {
                gsap.set(root.querySelectorAll('.media img:not(:nth-child(' + (index + 1) + '))'), { autoAlpha: 0 })
            }
        })

        placeMedias(title, true)
    }

    function applyZone(clientX, force = false) {
        if (clientX < 0 || clientX > window.innerWidth) return

        const zone = Math.min(4, Math.floor(clientX / (window.innerWidth / 5)))
        const zoneChanged = zone !== currentZone

        if (zoneChanged) currentZone = zone
        if (!zoneChanged && !force) return

        const title = getActiveTitle()
        if (title) placeMedias(title)
    }

    function onPointerZone(e) {
        const clientX = e.touches?.[0]?.clientX ?? e.clientX
        if (clientX != null) applyZone(clientX)
    }

    // Initial placement for the first line (still invisible)
    const initial = computePositions(lines[0].title)
    medias.forEach((media, i) => {
        gsap.set(media, { x: initial.slots[i].x, y: initial.y, scale: 1 })
        hiddenState[i] = initial.slots[i].hidden
    })

    function setupScrollLines() {
        const triggers = lines.map(({ title, index }) =>
            ScrollTrigger.create({
                trigger: title,
                start: 'top center',
                end: '+=' + heightItem + 'px',
                onEnter: () => revealMedias(index),
                onEnterBack: () => revealMedias(index),
            })
        )

        triggers.push(
            ScrollTrigger.create({
                trigger: lines[0].title,
                start: 'top center',
                onLeaveBack: hideMediasContainer
            }),
            ScrollTrigger.create({
                trigger: lines[lines.length - 1].title,
                start: 'top center',
                end: 'bottom center',
                onLeave: hideMediasContainer
            })
        )

        return triggers
    }

    function bindMobileSwipe() {
        let swipe = null

        const onStart = (e) => {
            if (!mediasActive || currentIndex < 0) return
            if (!lines[currentIndex].item.contains(e.target)) return

            const touch = e.touches?.[0]
            if (!touch) return

            swipe = { startX: touch.clientX, startY: touch.clientY, axis: null }
            applyZone(touch.clientX, true)
        }

        const onMove = (e) => {
            if (!swipe) return

            const touch = e.touches?.[0]
            if (!touch) return

            const dx = touch.clientX - swipe.startX
            const dy = touch.clientY - swipe.startY

            if (swipe.axis === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
                swipe.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
            }

            if (swipe.axis === 'x') applyZone(touch.clientX)
        }

        const onEnd = () => { swipe = null }

        list.addEventListener('touchstart', onStart, { passive: true })
        list.addEventListener('touchmove', onMove, { passive: true })
        list.addEventListener('touchend', onEnd)
        list.addEventListener('touchcancel', onEnd)

        return () => {
            list.removeEventListener('touchstart', onStart)
            list.removeEventListener('touchmove', onMove)
            list.removeEventListener('touchend', onEnd)
            list.removeEventListener('touchcancel', onEnd)
        }
    }

    const mm = gsap.matchMedia()

    mm.add('(max-width: 768px)', () => {
        const scrollTriggers = setupScrollLines()
        const unbindSwipe = bindMobileSwipe()

        return () => {
            scrollTriggers.forEach(st => st.kill())
            unbindSwipe()
        }
    })

    mm.add('(min-width: 769px)', () => {
        const liHandlers = lines.map(({ item, index }) => {
            const onEnter = () => revealMedias(index)
            item.addEventListener('mouseenter', onEnter)
            return { item, onEnter }
        })

        list.addEventListener('mouseenter', showMediasContainer)
        list.addEventListener('mouseleave', hideMediasContainer)
        window.addEventListener('mousemove', onPointerZone)
        window.addEventListener('touchstart', onPointerZone, { passive: true })
        window.addEventListener('touchmove', onPointerZone, { passive: true })

        return () => {
            liHandlers.forEach(({ item, onEnter }) => item.removeEventListener('mouseenter', onEnter))
            list.removeEventListener('mouseenter', showMediasContainer)
            list.removeEventListener('mouseleave', hideMediasContainer)
            window.removeEventListener('mousemove', onPointerZone)
            window.removeEventListener('touchstart', onPointerZone)
            window.removeEventListener('touchmove', onPointerZone)
        }
    })

    const observer = new MutationObserver(mutations => {
        const isRootRemoved = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.removedNodes).includes(root)
        )

        if (isRootRemoved) {
            mm.revert()
            observer.disconnect()
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    
	ScrollTrigger.refresh()
})