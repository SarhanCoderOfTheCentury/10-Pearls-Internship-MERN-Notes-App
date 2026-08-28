import { useState, useEffect } from "react";

function useUnsavedChanges(isDirty) {
  useEffect(() => {
    function handleBeforeUnload(event) {
      if (!isDirty) {
        return;
      }
    //   prevents the action from happening i.e page unload
      event.preventDefault();
      event.returnValue = "";
    }
    //  before unload is an event handler that runs before page unloads
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
}

export default useUnsavedChanges;
