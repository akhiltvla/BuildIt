import React, { useEffect, useState } from "react";
import { Container, Card, Button, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import pm from "../assets/pm.jpg";
import se from "../assets/se.jpg";
import site from "../assets/site.jpg";
import build1 from "../assets/build1.jpg";
import build2 from "../assets/build2.jpg";
import build3 from "../assets/build3.jpg";
import Project from "../assets/Project.jpg";

const Hero = () => {
  const imageSize = 130;
  const cardSize = 800;

  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      setShowFooter(isScrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="py-5">
        {/* <div className='py-3'> */}
        <div className="row">
          {/* <h1 className='text-center mb-4'>BuildIt</h1> */}
          {/* <Container className='d-flex justify-content-start align-items-center'>
        <div className="d-flex"> */}

          <div className={"col-sm-2 py-5"}>
            {/* First Card */}
            <Card
              className={`p-1 py-5 d-flex align-items-center hero-card bg-light w-${cardSize} me-2`}
            >
              <Image
                src={pm}
                width={imageSize}
                height={imageSize}
                alt="Description"
              />
              <h3 className="text-center mb-4">
                Site <br />
                Engineer
              </h3>
              <div className="d-flex">
                <LinkContainer to="/login">
                  <Button variant="primary" className="me-3">
                    Sign In
                  </Button>
                </LinkContainer>
              </div>
            </Card>
          </div>
          {/* Second Card (Duplicate) */}
          <div className="col-sm-2 py-5">
            <Card
              className={`p-2 py-5 d-flex flex-column align-items-center hero-card bg-light w-${cardSize} me-1`}
            >
              <Image
                src={se}
                width={imageSize}
                height={imageSize}
                alt="Description"
              />
              <h3 className="text-center mb-4">
                Project
                <br /> Manager
              </h3>
              <div className="d-flex">
                <LinkContainer to="/pmLogin">
                  <Button variant="primary" className="me-3">
                    Sign In
                  </Button>
                </LinkContainer>
              </div>
            </Card>
          </div>
          <div className="col-sm-8">
            <Image
              src={site}
              width="750"
              className="img-fluid"
              style={{ maxHeight: "450px" }}
              alt="Description"
              p-2
            />
          </div>
        </div>
      </div>
      <div>
        <Image
          src={build1}
          className="img-fluid"
          style={{ maxHeight: "450px", marginBottom: "20px" }}
          alt="Description"
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Image
          src={build2}
          className="img-fluid"
          style={{ maxHeight: "450px", marginBottom: "20px" }}
          alt="Description"
        />
      </div>

      <div className="d-flex justify-content-center mt-5">
        <div>
          <Image
            src={build3}
            className="img-fluid"
            style={{ maxHeight: "450px", marginBottom: "20px" }}
            alt="Description"
          />
        </div>
      </div>
      {showFooter && (
        <footer className="footer bg-dark text-white text-center py-3 position-fixed bottom-0 start-0 w-100">
          <Container>
            <p>© 2024 AkSoft. All rights reserved.</p>
          </Container>
        </footer>
      )}
    </>
  );
};

export default Hero;
