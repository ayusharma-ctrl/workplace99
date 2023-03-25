import React from "react";
import Cards from "../common/Cards";
import marketingVec from "../../assets/marketingVec.png";
import designVec from "../../assets/designVec.png";
import hrVec from "../../assets/hrVec.png";
import financeVec from "../../assets/financeVec.png";
import pmVec from "../../assets/pmVec.png";
import customerSuppVec from "../../assets/customerSuppVec.png";
import consultingVec from "../../assets/consultingVec.png";
import SVG from './../../assets/svg.png'


const data = [
  {
    title: "Marketing & Communication",
    subtitle: "2.1k Jobs Available",
    icon: marketingVec,
  },
  {
    title: "Design & Development",
    subtitle: "1.5k Jobs Available",
    icon: designVec,
  },
  {
    title: "HR & Development",
    subtitle: "1.3k Jobs Available",
    icon: hrVec,
  },
  {
    title: "Finance Management",
    subtitle: "1.1k Jobs Available",
    icon: financeVec,
  },
  {
    title: "Project Management",
    subtitle: "1.2k Jobs Available",
    icon: pmVec,
  },
  {
    title: "Customer Support",
    subtitle: "2.8k Jobs Available",
    icon: customerSuppVec,
  },
  {
    title: "Business & Consulting",
    subtitle: "2.3k Jobs Available",
    icon: consultingVec,
  },
];


function OnePlatform() {
  return (
    <div className="one-platform-container"
      style={{
        backgroundImage: `url(${SVG})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      <h1>
        One Platform Many <span>Solutions</span>
      </h1>
      <div>
        {data.map((item, index) => {
          return (
            <Cards
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

export default OnePlatform;
