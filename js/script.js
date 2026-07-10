/* ========================================================
   JAVA - JL ENVIRONMENTAL CONSULTING
========================================================= */

window.addEventListener("load", () => {
    if (!window.gsap || !window.ScrollTrigger) {
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* ===================== VARIABLES ===================== */
    let scrollTriggers = [];
    const isMobile = window.innerWidth < 901;

    /* ===================== HEADER STICKY ===================== */
    const header = document.querySelector("header");
    if (header) {
        const updateHeader = () => {
            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };

        updateHeader();
        window.addEventListener(
            "scroll",
            updateHeader
        );
    }

    /* ===================== CLEAN SCROLLTRIGGER ===================== */
    function killAllScrollTriggers() {
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger && trigger.kill) {
                trigger.kill();
            }
        });
        scrollTriggers = [];
        gsap.killTweensOf(".reveal");
    }

    /* ===================== GSAP RESPONSIVE ===================== */
    const mm = gsap.matchMedia();
    mm.add("(max-width:900px)", () => {
        killAllScrollTriggers();
        gsap.utils.toArray(".reveal")
        .forEach(el => {
            gsap.set(
                el,
                {
                    opacity:1,
                    y:0,
                    clearProps:"all"
                }
            );
        });
        ScrollTrigger.refresh();
        return () => {
            killAllScrollTriggers();
        };
    });

    mm.add("(min-width:901px)", () => {
        gsap.utils.toArray(".reveal")
        .forEach(el => {
            const tween =
            gsap.fromTo(
                el,
                {
                    opacity:0,
                    y:60
                },
                {
                    opacity:1,
                    y:0,
                    duration:1,
                    ease:"power3.out",
                    scrollTrigger:{
                        trigger:el,
                        start:"top 85%",
                        toggleActions:
                        "play none none none",
                        invalidateOnRefresh:true
                    }
                }
            );

            if(tween.scrollTrigger){
                scrollTriggers.push(
                    tween.scrollTrigger
                );
            }
        });

        ScrollTrigger.refresh();
        return () => {
            killAllScrollTriggers();
        };
    });

    /* ===================== HERO PARALLAX ===================== */
    if(!isMobile){
        const hero =
        document.querySelector(".hero1");
        if(hero){
            gsap.to(
                hero,
                {
                    backgroundPosition:
                    "center 100px",
                    ease:"none",
                    scrollTrigger:{
                        trigger:hero,
                        start:"top top",
                        end:"bottom top",
                        scrub:0.5,
                        invalidateOnRefresh:true
                    }
                }
            );
        }
    }

    /* ===================== CONTACT FORM + FORMSPREE ===================== */
    const form =
    document.querySelector("#contactForm");
    if(form){
        const panels =
        form.querySelectorAll(".step-panel");
        const steps =
        form.querySelectorAll(".step");
        const nextBtn =
        form.querySelector(".btn-next");
        const prevBtn =
        form.querySelector(".btn-prev");
        const submitBtn =
        form.querySelector(".btn-submit");
        const counter =
        form.querySelector(".step-count");
        let currentStep = 0;
        const totalSteps = 3;
        function updateForm(){
            panels.forEach((panel,index)=>{
                panel.classList.toggle(
                    "active",
                    index === currentStep
                );
            });

            steps.forEach((step,index)=>{
                step.classList.remove(
                    "active",
                    "done"
                );
                if(index < currentStep){
                    step.classList.add("done");
                }
                if(index === currentStep){
                    step.classList.add("active");
                }
            });

            if(counter){
                counter.textContent =
                `Étape ${currentStep + 1} / ${totalSteps}`;
            }

            if(prevBtn){
                prevBtn.style.display =
                currentStep === 0
                ? "none"
                : "inline-flex";
            }

            if(nextBtn){
                nextBtn.style.display =
                currentStep === totalSteps - 1
                ? "none"
                : "inline-flex";
            }

            if(submitBtn){
                submitBtn.style.display =
                currentStep === totalSteps - 1
                ? "inline-flex"
                : "none";
            }
        }

        nextBtn?.addEventListener(
        "click",
        ()=>{
            if(currentStep < totalSteps - 1){
                currentStep++;
                updateForm();
            }
        });

        prevBtn?.addEventListener(
        "click",
        ()=>{
            if(currentStep > 0){
                currentStep--;
                updateForm();
            }
        });

        /* ===================== ENVOI FORMSPREE ===================== */
        form.addEventListener(
        "submit",
        async(event)=>{
            event.preventDefault();
            event.stopPropagation();
            if(submitBtn){
                submitBtn.disabled = true;
                submitBtn.style.pointerEvents =
                "none";
                submitBtn.innerHTML =
                "Envoi en cours...";
            }
            try {
                const response =
                await fetch(
                    form.action,
                    {
                        method:"POST",
                        body:new FormData(form),
                        headers:{
                            Accept:
                            "application/json"
                        }
                    }
                );

                if(!response.ok){
                    throw new Error(
                        "Erreur Formspree"
                    );
                }

                form.querySelectorAll(
                    ".step-panel"
                )
                .forEach(panel=>{
                    panel.style.display="none";
                });

                const stepper =
                form.querySelector(".stepper");
                const nav =
                form.querySelector(".step-nav");
                if(stepper){
                    stepper.style.display="none";
                }
                if(nav){
                    nav.style.display="none";
                }

                const success =
                form.querySelector(".success")
                ?.closest(".step-panel");
                if(success){
                    success.style.display="block";
                }
                form.reset();
            }

            catch(error){
                console.error(error);
                alert(
                "Une erreur est survenue pendant l'envoi."
                );
                if(submitBtn){
                    submitBtn.disabled=false;
                    submitBtn.style.pointerEvents =
                    "auto";
                    submitBtn.innerHTML =
                    `
                    <span>Envoyer ma demande</span>
                    <svg class="arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                    `;
                }
            }
        });

        updateForm();
    }

    /* ===================== REFRESH ===================== */
    setTimeout(()=>{
        ScrollTrigger.refresh(true);
    },500);

    /* ===================== RESIZE ===================== */
    let resizeTimeout;
    window.addEventListener(
    "resize",
    ()=>{
        clearTimeout(resizeTimeout);
        resizeTimeout =
        setTimeout(()=>{
            ScrollTrigger.refresh();
        },250);
    });

    /* ===================== ORIENTATION ===================== */
    window.addEventListener(
    "orientationchange",
    ()=>{
        setTimeout(()=>{
            ScrollTrigger.refresh(true);
        },300);
    });

    /* ===================== FOOTER ===================== */
    const year =
    document.querySelector(".year");
    if(year){
        year.textContent =
        new Date().getFullYear();
    }
});