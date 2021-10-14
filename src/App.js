import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { Container } from "@mui/material";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Stack from "@mui/material/Stack";
import Logo from "./Assets/android-chrome-192x192.png";
import stamp from "./Assets/android-chrome-512x512.png";

function App() {
	const imgRef = useRef();
	const Pictref = useRef(null);

	const [File, setFile] = useState();
	const [Image, setImage] = useState("");

	const [name, setname] = useState("");

	const [Generate, setGenerate] = useState(false);

	const filename = `Rapec-${name.split(/[ ]/)[0]}.jpeg`;

	useEffect(() => {
		if (File) {
			const Reader = new FileReader();
			Reader.onload = () => {
				setImage(Reader.result);
			};
			Reader.readAsDataURL(File);
		} else {
			setImage(null);
		}
	}, [File]);

	const DownloadImage = useCallback(() => {
		if (Pictref.current === null) {
			return;
		}

		toJpeg(Pictref.current, { cacheBust: true, quality: 0.95 })
			.then((dataUrl) => {
				const link = document.createElement("a");
				link.download = filename;
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => {
				console.log(err);
			});
	}, [Pictref]);

	return (
		<div className='App'>
			<div className='container'>
				<div className='form__container'>
					{!Generate && (
						<Container
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div className='first__container'>
								<div className='title__container'>
									<img src={Logo} alt='logo' />

									<h3>RAPEC 22<sup>nd</sup>  Annual Convention</h3>
								</div>
								<form action=''>
									<Box
										component='form'
										sx={{
											"& > :not(style)": { m: 1, width: "40ch" },
										}}
										noValidate
										autoComplete='on'
									>
										<div className='img__container'>
											{Image ? (
												<img src={Image} alt='' className='img__prev' />
											) : (
												<button
													className='img__btn'
													onClick={(e) => {
														e.preventDefault();
														imgRef.current.click();
													}}
												>
													Click to Add Image
												</button>
											)}
										</div>
										<div className='input__wrapper'>
											<input
												type='file'
												accept='image/*'
												style={{ display: "none" }}
												ref={imgRef}
												onChange={(e) => {
													const file = e.target.files[0];

													if (file && file.type.substring(0, 5) === "image") {
														setFile(file);
													} else {
														setFile(null);
													}
												}}
											/>
											<TextField
												id='outlined-basic'
												label='Full Name'
												variant='outlined'
												placeholder='Jesutofunmi Emmanuel'
												value={name}
												onChange={(e) => {
													setname(e.target.value);
												}}
											/>
										</div>
									</Box>

									<Stack
										direction='row'
										spacing={2}
										style={{ marginBottom: "10px" }}
									>
										<Button
											variant='contained'
											onClick={() => {
												setGenerate(true);
											}}
											endIcon={<SendIcon />}
											disabled={!name}
										>
											Generate
										</Button>
									</Stack>
								</form>
							</div>
						</Container>
					)}

					{Generate && (
						<Container>
							<div className='wrapper'>
								<div className='print__container' ref={Pictref}>
									<div className='print__items'>
										<img src={stamp} alt='' className='stamp' />
										<img src={Image} alt='' className='print__pics' />
										<h2 className='print__name'>{name}</h2>
									</div>
								</div>

								<Button
									style={{ margin: "10px" }}
									onClick={DownloadImage}
									variant='contained'
									endIcon={<SaveAltIcon />}
								>
									Save
								</Button>
							</div>
						</Container>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
