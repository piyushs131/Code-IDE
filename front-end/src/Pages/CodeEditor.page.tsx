import { useEffect, useState } from "react";
import Footer from "../Components/Footer/Footer.component";
import Main from "../Components/Layout/Main.component";
import SideDrawer from "../Components/sideDrawer/sideDrawer.component";
import {
  SIDE_PANNEL_RESIZER_WIDTH,
  SIDE_PANNEL_WIDTH,
} from "../Components/sidePannel/SidePannel.constants";
import {
  setShowInBottomPannel,
  toggleIsBottomPannelOpen,
} from "../Store/reducres/BottomPannel/BottomPannel.reducer";

import { addFileToNavigation } from "../Store/reducres/Navigation/FileNavigation.reducer";
import {
  setShowInSideDrawer,
  toggleIsDrawerOpen,
} from "../Store/reducres/SideDrawer/SideDrawer.reducer";

import { useAppDispatch, useAppSelector } from "../Store/store";
import { mergeClass } from "../library/tailwindMerge/tailwindMerge.lib";

export const CODE_EDITOR_MIN_WIDTH = 320;
export const CODE_EDITOR_MIN_HEIGHT = 480;

const CodeEditor = () => {
  const isDrawerOpen = useAppSelector((state) => state.sideDrawer.isDrawerOpen);
  const isSidePannelPositionOnLeft = useAppSelector(
    (state) => state.sideDrawer.isSidePannelPositionOnLeft
  );
  const sideDrawerWidth = useAppSelector(
    (state) => state.sideDrawer.sideDrawerWidth
  );

  useAppResizer();
  useShortcutKeys();


  let remainingWidth =
    Math.max(document.body.clientWidth, CODE_EDITOR_MIN_WIDTH) -
    SIDE_PANNEL_WIDTH;

  remainingWidth -= isDrawerOpen
    ? sideDrawerWidth + SIDE_PANNEL_RESIZER_WIDTH
    : 0;

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={mergeClass([
          "flex h-full",
          !isSidePannelPositionOnLeft && "flex-row-reverse",
        ])}
      >
        <div className="right w-fit">
          <SideDrawer />
        </div>
        <div
          className="flex flex-col justify-between h-full left bg-[color:var(--codeeditor-color)]"
          style={{ width: remainingWidth }}
        >
          <Main />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const useAppResizer = () => {
  const [, setWidthChange] = useState(0);
  useEffect(() => {
    const manageEditorWidthAndHeight = () => {
      if (
        document.body.clientWidth > CODE_EDITOR_MIN_WIDTH ||
        document.body.clientHeight > CODE_EDITOR_MIN_HEIGHT
      )
        // just to rerender as reszing done
        setWidthChange(document.body.clientWidth + document.body.clientHeight);
    };
    window.addEventListener("resize", manageEditorWidthAndHeight);
    return () => {
      window.removeEventListener("resize", manageEditorWidthAndHeight);
    };
  }, []);
};

const useShortcutKeys = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const shortcutActions: Record<string, () => void> = {
      'Ctrl+`': () => {
        dispatch(toggleIsBottomPannelOpen());
        dispatch(setShowInBottomPannel("terminal"));
      },
      'Ctrl+B': () => dispatch(toggleIsDrawerOpen()),
      'Ctrl+Shift+P': () => {
        dispatch(toggleIsDrawerOpen());
        dispatch(setShowInSideDrawer("file"));
      },
      'Ctrl+,': () => {
        dispatch(addFileToNavigation({ id: "setting", type: "setting" }));
      }
    };

    const normalizeKey = (e: KeyboardEvent): string => {
      let keys = [];
      if (e.ctrlKey || e.metaKey) keys.push("Ctrl");
      if (e.shiftKey) keys.push("Shift");
      keys.push(e.key.toUpperCase());
      return keys.join("+");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const keyCombo = normalizeKey(e);
      const action = shortcutActions[keyCombo];
      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
};
