import json
import os

import bpy


scene = bpy.context.scene
objects = []
for obj in scene.objects:
    objects.append(
        {
            "name": obj.name,
            "type": obj.type,
            "location": [round(value, 3) for value in obj.location],
            "dimensions": [round(value, 3) for value in obj.dimensions],
        }
    )

payload = {
    "scene": scene.name,
    "engine": scene.render.engine,
    "active_camera": scene.camera.name if scene.camera else None,
    "objects": objects,
}
print("PORTFOLIO_BLOCKOUT_AUDIT=" + json.dumps(payload, ensure_ascii=False))

output_path = os.environ.get("PORTFOLIO_BLOCKOUT_RENDER")
if output_path and scene.camera:
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.filepath = output_path
    bpy.ops.render.render(write_still=True)
    print("PORTFOLIO_BLOCKOUT_RENDER=" + output_path)
