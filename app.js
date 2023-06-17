import { Color, LineBasicMaterial, MeshBasicMaterial } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";

const container = document.getElementById('viewer-container')
const viewer = new IfcViewerAPI({container, backgroundColor: new Color(0xffffff)});
viewer.axes.setAxes();
viewer.grid.setGrid();
// viewer.IFC.loadIfcUrl('./Concrete.ifc');

loadIfc('./01.ifc');


async function loadIfc(url) {
		// Load the model
    const model = await viewer.IFC.loadIfcUrl(url);

		// Add dropped shadow and post-processing efect
    await viewer.shadowDropper.renderShadow(model.modelID);
    
    await viewer.plans.computeAllPlanViews(model.modelID);

    const lineMaterial = new LineBasicMaterial({ color: 'black' });
	  const baseMaterial = new MeshBasicMaterial({
		polygonOffset: true,
		polygonOffsetFactor: 1, // positive value pushes polygon further away
		polygonOffsetUnits: 1,
    });

    viewer.edges.create('example-edges', model.modelID, lineMaterial, baseMaterial);

    const allPlans = viewer.plans.getAll(model.modelID);

    const container = document.getElementById("button-container");
    

    for(const plan of allPlans) {
      const currentPlan = viewer.plans.planLists[model.modelID][plan];
      console.log(currentPlan);

      const button = document.createElement('button');
      container.appendChild(button);
      button.textContent = currentPlan.name;
      button.onclick = () => {
        viewer.plans.goTo(model.modelID, plan);
        viewer.edges.toggle('example-edges', true);
        togglePostproduction(false); 
      }
    }

    const button = document.createElement('button');
    container.appendChild(button);
    button.textContent = "Exit floorplans";
    button.onclick = () => {
      viewer.plans.exitPlanView();
      viewer.edges.toggle('example-edges', false);
      togglePostproduction(true); 
    }

}

function togglePostproduction(active) {
  viewer.context.renderer.postProduction.active = active;
}
