# Sumerian glTF Export

## Overview
Sumerian provides customers the option to export their scenes to the glTF file format. 

The following will always be **included** in the export if it is present in the scene:
* Entity Geometry
* Materials (Classic and PBR)
* Scene layout/entity hierarchy
* Textures

The following will always be **excluded** from the export:
* Animations
* HMDCamera
* Particles
* Physics
* Scripts
* Skeletons
* State Machines
* Timelines
* VRCameraRig

If an entity contains an excluded component, then that entity will be present in the glTF without the excluded component.

## Export Options
Customers can opt to include the following assets in their exported glTF:

#### Lights
If the "Lights" option is checked, the following lights will be included in the export:
* Directional
* Spot
* Point

#### Cameras
If the "Cameras" option is checked, the following will be included in the export:
* Cameras
* Camera Components

If the "Cameras" option is unchecked, then all entities with a Camera component will export without the Camera component.

When importing a glTF file into some glTF viewers, you may be expected to calculate and apply the camera aspect ratio yourself by dividing canvas width by height.


#### Image-Based Lighting
If the "Image-Based Lighting" option is checked, then the scene’s Image-Based Lighting will be included in the export. The extension EXT_lights_image_based is used to support Image-Based Lighting for glTF.

#### Unused Assets
If the "Unused Assets" option is checked, then any assets that are not placed within the scene but exist within the "Assets" panel will be included in the export.

## Materials
Some materials supported by Sumerian will not translate perfectly in the export to glTF, and may appear differently after being exported. The core glTF specification only supports Physically-Based Rendering (PBR) materials, specifically the metallic roughness material model. The following is how each Sumerian material is handled for glTF:
* PBR Metalness: directly maps to glTF PBR metallic roughness workflow.
* PBR Specular: uses the glTF extension KHR_materials_pbrSpecularGlossiness, which is supported by many engines including Babylon.js and Three.js
* Classic: converted to PBR metallic roughness. Some Classic material components do not have equivalent representation for PBR metallic roughness workflow, and you should expect that the environmental lighting will have to be adjusted on the exported scene. The Classic material components and properties dropped from the conversion are:
  * Ambient
  * Culling
  * Depth
  * Reflectivity
  * Refractivity
  * Shading
