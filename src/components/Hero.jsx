import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {

    const videoRef = useRef();
    const [videoSource, setVideoSource] = useState("/videos/input.mp4");
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);
    const isMobile = useMediaQuery({maxWidth: 767});

    // Handle video source changes
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.load();
            // Initial load but don't auto-play
            // Video will only play during scrolling
        }
    }, [videoSource]);

    // Handle scroll-based video playback
    useEffect(() => {
        const handleScroll = () => {
            // User is scrolling - set scrolling state to true
            setIsScrolling(true);

            // Play video when scrolling
            if (videoRef.current && videoRef.current.paused) {
                videoRef.current.play().catch(error => {
                    console.warn("Video play failed:", error);
                });
            }

            // Clear any existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Set a timeout to detect when scrolling stops
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
                // Pause video when scrolling stops
                if (videoRef.current && !videoRef.current.paused) {
                    videoRef.current.pause();
                }
            }, 150); // Adjust timeout as needed for smooth experience
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    useGSAP(() => {

        const heroSplit = new SplitText(".title", {type: "chars, words"});

        const paragraphSplit = new SplitText(".subtitle", {type: "lines"});

        heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

        gsap.from(heroSplit.chars, {
            yPercent: 100,
            duration: 1.8,
            ease: "expo.out",
            stagger: 0.05
        })

        gsap.from(paragraphSplit.lines, {
            opacity: 0,
            yPercent: 100,
            duration: 1.8,
            ease: "expo.out",
            delay: 1,
            stagger: 0.05
        })

        gsap.timeline({scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }})
        .to(".right-leaf", {y: 200}, 0)
        .to(".left-leaf", {y: -200}, 0)

        const startValue = isMobile ? "top 50%" : "center 60%";
        const endValue = isMobile ? "120% top" : "bottom top";

        // Create a timeline for video animations
        const videoTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "video",
                start: startValue,
                end: endValue,
                scrub: true,
                pin: true
            }
        });

      videoRef.current.onloadedmetadata = () => {
          videoTimeline.to(videoRef.current, {
              currentTime: videoRef.current.duration
          })
      }

    }, [])

  return (
    <>
        <section id="hero" className='noisy'>

            <h1 className='title'>MOJITO</h1>

            <img src="/images/hero-left-leaf.png"
                 alt="left-leaf" 
                 className='left-leaf'/>

            <img src="/images/hero-right-leaf.png"
                 alt="right-leaf" 
                 className='right-leaf'/>

            <div className="body borderr">
                <div className="content borderr">
                    <div className="space-y-5 hidden md:block borderr">
                        <p className='borderr'>Cool. Crisp. Classic</p>
                        <p className="subtitle borderr">
                            Sip the Spirit <br/> of Summer
                        </p>
                    </div>
                    <div className="view-cocktails">
                        <p className="subtitle">
                            Every cocktail on our menu is a blend of premium ingredients, creative flair, and timeless recipes - designed to delight your senses.
                        </p>
                        <a href="#cocktails">View Cocktails</a>
                    </div>
                </div>
            </div>

        </section>
        <div className="video absolute inset-0 borderr">
            <video
                    ref={videoRef}
                    src={videoSource}
                    muted
                    playsInline
                    preload="auto"/>
        </div>
    </>
  )
}

export default Hero
