# Singapore Marina Bay 3D Model

This workspace contains a stylized low-poly 3D model of the Marina Bay area in Singapore.

Files:

- `generate-marina-bay.ps1`: PowerShell generator for the model.
- `output/singapore_marina_bay.obj`: Wavefront OBJ mesh.
- `output/singapore_marina_bay.mtl`: Material file used by the OBJ.

How to generate:

```powershell
.\generate-marina-bay.ps1
```

How to open:

- Import `output/singapore_marina_bay.obj` into Blender, MeshLab, Maya, or any OBJ-compatible viewer.
- Keep the `.obj` and `.mtl` files in the same folder so materials load correctly.

Included landmarks:

- Marina Bay Sands
- ArtScience Museum
- Singapore Flyer
- Esplanade
- Merlion Park
- Marina Bay water basin, promenade, skyline, and supertrees
