package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.CreateElementCategory
import no.vargstudios.bifrost.server.api.model.ElementCategory
import no.vargstudios.bifrost.server.api.model.Name
import no.vargstudios.bifrost.server.db.ElementCategoryDao
import no.vargstudios.bifrost.server.db.ElementDao
import no.vargstudios.bifrost.server.db.model.ElementCategoryRow
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1/element-categories")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class ElementCategoryApi(val elementCategoryDao: ElementCategoryDao, val elementDao: ElementDao) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    @GET
    fun listCategories(): List<ElementCategory> {
        return elementCategoryDao.list().map {
            mapCategory(it, elementDao.listForCategory(it.id).size)
        }
    }

    @POST
    fun createCategory(createCategory: CreateElementCategory): ElementCategory {
        if (createCategory.name.length < 3) {
            throw BadRequestException("Category name must be at least 3 characters")
        }
        if (elementCategoryDao.list().any { it.name == createCategory.name }) {
            throw BadRequestException("Category name already exists")
        }
        val category = ElementCategoryRow(
            name = createCategory.name
        )
        elementCategoryDao.insert(category)
        logger.info("Created category ${category.id}")
        return mapCategory(category, 0)
    }

    @GET
    @Path("/{categoryId}")
    fun getCategory(@PathParam("categoryId") categoryId: String): ElementCategory {
        val category = elementCategoryDao.get(categoryId) ?: throw NotFoundException()
        return mapCategory(category, elementDao.listForCategory(categoryId).size)
    }

    @DELETE
    @Path("/{categoryId}")
    fun deleteCategory(@PathParam("categoryId") categoryId: String) {
        if (elementDao.listForCategory(categoryId).isNotEmpty()) {
            throw BadRequestException("Category is not empty")
        }
        elementCategoryDao.delete(categoryId)
    }

    @PUT
    @Path("/{categoryId}/name")
    fun renameCategory(@PathParam("categoryId") categoryId: String, name: Name) {
        val category = elementCategoryDao.get(categoryId) ?: throw NotFoundException()
        if (category.name == name.value) {
            logger.warn("Name unchanged")
            return
        }
        elementCategoryDao.setName(category.id, name.value)
    }

    private fun mapCategory(category: ElementCategoryRow, elements: Int): ElementCategory {
        return ElementCategory(
            id = category.id,
            name = category.name,
            elements = elements
        )
    }

}
