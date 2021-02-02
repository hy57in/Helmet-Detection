import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import Webcam from "react-webcam";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import "./Camera.css";

function toScreenshot(e) {
  e.target.setAttribute("src", "https://source.unsplash.com/LYK3ksSQyeo");
  e.target.setAttribute("alt", "screenshot");
}

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenshot: null,
      result: null,
      image: null,
      image2: null,
      timeval: 0,
      changePlaceholder: false,
      open:false,
      webcamopen:true,
      iscaptured:false,
    };
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({ screenshot: imageSrc, changePlaceholder: true , iscaptured:true});
  };

  uploadImage = (image) => {
    const url = "http://localhost:8000/images";
    const data = new FormData();

    const imageSrc = this.webcam.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        data.append("file", blob, "face3.jpg");

        const options = {
          method: "post",
          body: data,
        };

        fetch(url, options)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            this.setState({
              result: res,
            });
          });
      });
  };

  showImage = () => {
    const url = "http://localhost:8000/web";

    fetch(url)
      .then((response) => {
        console.log(response);
        return response.blob();
      })
      .then((blob) => {
        console.log(blob);
        var reader = new FileReader();

        reader.onload = function () {
          var base64data = reader.result;
          console.log(base64data);
        };
        reader.readAsDataURL(blob);
        this.setState({
          image: reader,
          image2: reader.result,
        });
        console.log(reader);
        console.log(reader.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  webcamoff = () => {
    this.setState({ webcamopen: !this.state.webcamopen });
  }
  reCapturing = () => {
    this.setState({ iscaptured:false, changePlaceholder:!this.state.changePlaceholder });
  }

  render() {
    const { screenshot, result, image, image2, changePlaceholder } = this.state;

    const useStyles = makeStyles((theme) => ({
      root: {
        flexGrow: 1,
      },
      container: {
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridGap: theme.spacing(4),
        justifyContent: "center",
      },

      paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(5),
        width: theme.spacing(20),
        height: theme.spacing(20),
        elevation: 3,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
      },
      divider: {
        margin: theme.spacing(2, 0),
      },
      backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
      },
    }));

    const handleClose = () => {
      this.setState((state) => ({ open: false }));
    };
    const handleToggle = () => {
      this.setState((state) => ({ open: true }));
    };
    const timechange = () => {
      let timeval = 0;
      let timerId = setTimeout(
        function tick() {
          this.setState({ timeval: this.state.timeval + 10 });

          if (this.state.timeval > 1000) {
            handleClose();
            return 0;
          } else {
            timerId = setTimeout(tick.bind(this), 20);
            handleToggle();
            console.log(this.state.timeval);
          }
        }.bind(this),
        20
      );
    };

    return (
      <div>
        <div className="header">
          <h1>Capture & Upload</h1>
          <h2>
            헬멧을 쓴 채로, <b>카메라</b>를 응시하세요.<br></br>
            <b>CAPTURE</b> 버튼을 눌러 사진을 찍고,<br></br>
            오른쪽에 나타난 스크린샷을 <b>UPLOAD</b> 하세요.
          </h2>
        
          <div className='big-container'>
            
        <div className='box-container'>
          <div className='box-left'>
          <Grid item md={12}>
          <Paper className='paper'>
            <div className='img-left'>
              {this.state.webcamopen?(                
              <Webcam
                  audio={false}
                  height={400}
                  width={400}
                  ref={this.setRef}
                  screenshotFormat="image/jpg"
                />)
                :
                (
                  <div>{this.state.webcamopen}</div>
                )}

              </div>
              {this.state.iscaptured?(
                <Fab
                variant="extended"
                color="primary"
                aria-label="add"
                className={useStyles.margin}
                onClick={() => this.reCapturing()}
              >
                reCapture
              </Fab>
              )
              :
              (
              <Fab
                variant="extended"
                color="primary"
                aria-label="add"
                className={useStyles.margin}
                onClick={() => this.capture()}
              >
                Capture
              </Fab>
              )
            }    
            </Paper>

          </Grid>
          </div>
                <br></br>
                <br></br>
          <div className='box-right'>
          <Grid item md={12}>
            <Paper className='paper'>

              <div className='img-right-wrapper'>
              
                {changePlaceholder?
                <div className='img-right'>
                {screenshot && (
                  <img
                    padding={10}
                    src={screenshot}
                    alt="screenshot"
                    height={300}
                    width={400}
                    margin={50}
                    alt="placeholder"
                  ></img>
                )}
                </div> :
                <div className='img-right'>            
                <img
                  src="https://www.thevision.no/wp-content/uploads/woocommerce-placeholder-400x300.png"
                  height={300}
                  width={400}
                  alt="placeholder"
                ></img>
                </div>
                }


              </div>
                
                {this.state.timeval > 1000? <RouterLink to={'/result'}>
                <Fab
                  variant="extended"
                  color="secondary"
                  aria-label="add"
                  className={useStyles.margin}
                  onClick={() => timechange()}
                >
                  upload
                </Fab>
              </RouterLink>
              :<Fab
              variant="extended"
              color="secondary"
              aria-label="add"
              className=''
              onClick={() => timechange()}
            >
              Uploading
            </Fab>}
              </Paper>


                  {this.state.timeval > 1000 ? (
                    <RouterLink to={"/result"}>
                      <Fab
                        variant="extended"
                        color="secondary"
                        aria-label="add"
                        className={useStyles.margin}
                        onClick={() => timechange()}
                      >
                        Upload
                      </Fab>
                    </RouterLink>
                  ) : (
                    <Fab
                      variant="extended"
                      color="secondary"
                      aria-label="add"
                      className={useStyles.margin}
                      onClick={() => timechange()}
                    >
                      Upload
                    </Fab>
                  )}
                </Paper>
              </Grid>
            </div>
          </div>
        </div>
          
          </div>
          
          {this.state.webcamopen?(          
          <Fab
              variant="extended"
              color="secondary"
              aria-label="add"
              className={useStyles.margin}
              onClick={() =>{this.webcamoff()}}
            >
              webcam off
            </Fab>):(          
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              className={useStyles.margin}
              onClick={() =>{this.webcamoff()}}
            >
              webcam on
            </Fab>)}
            
            <br/>
            <br/>
            <br/>
      <Backdrop className='back-drop' open={this.state.open} onClick={handleClose}>
        <CircularProgress color="inherit"  />
      </Backdrop>


        {this.state.webcamopen ? (
          <Fab
            variant="extended"
            color="secondary"
            aria-label="add"
            className={useStyles.margin}
            onClick={() => {
              this.webcamoff();
            }}
          >
            webcam off
          </Fab>
        ) : (
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            className={useStyles.margin}
            onClick={() => {
              this.webcamoff();
            }}
          >
            webcam on
          </Fab>
        )}
        <br />
        <br />
        <br />
        <Backdrop
          className="back-drop"
          open={this.state.open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}

export default Camera;
