import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import Footer from "../components/Footer";
import Header from "../components/Header";

// Configuration for the uploader
const uploader = Uploader({ apiKey: "free" });
const options = { maxFileCount: 1, mimeTypes: ["image/jpeg", "image/png", "image/jpg"], editor: { images: { crop: false } } };

const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setOriginalPhoto(file[0].fileUrl);
          generatePhoto(file[0].fileUrl);
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    let newPhoto = await res.json();
    setRestoredImage(newPhoto);
    setLoading(false);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Restore Photos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl mb-5">Restore your photos</h1>

        <div className="flex justify-between items-center w-full flex-col mt-6">
          {/* TODO: Throw some Framer Motion here to resize dynamically */}
          {!originalPhoto && <UploadDropZone />}
          {originalPhoto && !restoredImage && <img src={originalPhoto} className="sm:h-80 h-60" />}
          {restoredImage && originalPhoto && (
            <div className="flex sm:space-x-2 sm:flex-row flex-col">
              <div>
                <h3 className="mb-1 font-medium text-lg">Original Photo</h3>
                <img src={originalPhoto} className="w-80 rounded-2xl" />
              </div>
              <div>
                <h3 className="mb-1 font-medium text-lg">Restored Photo</h3>
                <img src={restoredImage} className="w-80 rounded-2xl sm:mt-0 mt-2" />
              </div>
            </div>
          )}
          {/* TODO: Add nice loading state */}
          {loading && <p>Generating photo...</p>}
          {originalPhoto && !loading && (
            <button
              onClick={() => {
                setOriginalPhoto(null);
                setRestoredImage(null);
              }}
              className="bg-black rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-black/80"
            >
              Upload New Photo
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;