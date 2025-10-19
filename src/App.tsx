import { Canvas } from "@react-three/fiber";
import {
  XR,
  createXRStore,
  XRSpace as XRSpaceProvider,
  useXR,
} from "@react-three/xr";
import { useEffect } from "react";
import { Skybox } from "./components";
import { BrowserRouter, Route, Routes } from "react-router";
import { RoundPage, HomePage, LobbyPage } from "./pages";

const store = createXRStore({
  // hand: CustomHand,
  hand: {
    left: true,
    right: true,
    model: true,
    rayPointer: { rayModel: { color: "red" }, makeDefault: true },
  },
  screenInput: false,
  defaultControllerProfileId: "generic-hand",
  defaultXRHandProfileId: "generic-hand",
  gaze: false,
  bodyTracking: true,
  handTracking: true,
  controller: false,
  /*   customSessionInit: {
    requiredFeatures: ["local-floor"],
    optionalFeatures: ["hand-tracking"],
  }, */
  emulate: {
    primaryInputMode: "hand",
  },
  // emulate: false,
});

function XRManager() {
  const { session } = useXR();

  useEffect(() => {
    session?.dispatchEvent(new Event(""));
    session?.addEventListener("inputsourceschange", () => {
      console.log("inputsourceschange", session.inputSources);
    });
  }, [session]);

  return null;
}

export default function App() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>

      <Canvas>
        <XR store={store}>
          <XRSpaceProvider space={"local-floor"}>
            <Skybox />
            <BrowserRouter>
              <Routes>
                <Route path="maestro-game-xr">
                  <Route index Component={HomePage} />
                  <Route path="lobby" Component={LobbyPage} />
                  <Route path="play/:id" Component={RoundPage} />
                </Route>
              </Routes>
            </BrowserRouter>

            <XRManager />
          </XRSpaceProvider>
        </XR>
      </Canvas>
    </>
  );
}
