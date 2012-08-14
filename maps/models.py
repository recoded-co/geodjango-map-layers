from django.db import models
from django.conf import settings
from django.template.defaultfilters import slugify

class Layer(models.Model):
    LAYER_TYPES = (
        ('BL','Base Layer'),
        ('OL','Overlay'),
    )
    
    PROTOCOLS = (
        ('ARCcache','ArcGIS Cache'),
        ('ARCGIS','ArcGIS93Rest'),
        ('WFS','WFS - Web Feature Service'),
        ('WMS','WMS - Web Map Service'),
        ('OSM','Open Street Maps'),
        ('WMTS','Web Map Tile Service'),
        ('TMS','Tile Map Service'),
    )
    
    name = models.CharField(max_length = 20)
    layer_type = models.CharField(max_length = 5,
                                  choices = LAYER_TYPES)
    protocol = models.CharField(max_length = 10,
                                choices = PROTOCOLS)
    source = models.URLField(blank = True)
    layer_info = models.TextField(editable = True,
                                  blank = True)
    layers = models.CharField(max_length = 300,
                              blank = True)
    
    def __unicode__(self):
        return self.name
        

class Map(models.Model):
    slug_name = models.SlugField(max_length = 50,
                                 primary_key = True,
                                 editable = False)
    name = models.CharField(max_length = 50)
    projection = models.CharField(max_length = 15,
                                  default = getattr(settings,
                                                    'SPATIAL_REFERENCE_SYSTEM_ID',
                                                    4326))
    max_resolution = models.IntegerField(default = 50,
                                         blank = True,
                                         null = True)
    max_extent = models.CharField(max_length = 750,
                                  blank = True)
    zoom_level = models.IntegerField(default = 10,
                                     blank = True)
    tile_size = models.CharField(max_length = 15,
                                 default = '256,256')
    layers = models.ManyToManyField(Layer)
    
    def save(self, *args, **kwargs):
        self.slug_name = slugify(self.name)
        super(Map, self).save(*args, **kwargs)
        
    def __unicode__(self):
        return self.name
