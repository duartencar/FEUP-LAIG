/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {

    this.graph = graph;

    this.xmlelem = xmlelem;
}

MyGraphLeaf.prototype.processXmlelem = function ()
{

}

MyGraphLeaf.prototype.logGeometry = function ()
{
    return this.xmlelem.text;
}
