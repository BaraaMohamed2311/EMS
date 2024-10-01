"use client";

import { usePathname } from "next/navigation";
import Nav from "../Nav/Nav";
import Menu from "../Menu/Menu";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default function LayoutProvider({children}){
    let pathname = usePathname()

    // function to decide UI content
    function DisplayOptions(pathname, children) {
        switch (pathname) {
          case "/login":
            return <>
                  <Nav />
                  {children }
                  </>;
    
          case "/list":
            //  we all display layout
            return (
              <>
                <Nav />
                <Menu />
                <div className="outlet">{children }</div>
              </>
            );
    
          // Add more cases for other specific routes if needed
    
          default:
            //  we all display only navbar
            return (
              <>
                <Nav />
                {children }
              </>
            );
        }
      }
    
      return( <>{DisplayOptions(pathname, children)}</>  );
    
}

// <Suspense fallback={Loading}> {children} </Suspense>
