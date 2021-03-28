package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.CreateElementCategory
import no.vargstudios.bifrost.server.api.model.ElementCategory
import no.vargstudios.bifrost.server.api.model.ElementCategoryWithCount
import no.vargstudios.bifrost.server.api.model.UpdateElementCategory
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
    fun listCategories(): List<ElementCategoryWithCount> {
        return elementCategoryDao.list().map {
            mapCategoryWithCount(it, elementDao.listForCategory(it.id).size)
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
        return mapCategory(category)
    }

    @GET
    @Path("/{categoryId}")
    fun getCategory(@PathParam("categoryId") categoryId: String): ElementCategory {
        val category = elementCategoryDao.get(categoryId) ?: throw NotFoundException("Category not found")
        return mapCategory(category)
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
    @Path("/{categoryId}")
    fun updateCategory(@PathParam("categoryId") categoryId: String, updateCategory: UpdateElementCategory) {
        val category = elementCategoryDao.get(categoryId) ?: throw NotFoundException("Category not found")
        if (category.name != updateCategory.name) {
            elementCategoryDao.setName(category.id, updateCategory.name)
        }
    }

    private fun mapCategory(category: ElementCategoryRow): ElementCategory {
        return ElementCategory(
            id = category.id,
            name = category.name
        )
    }

    private fun mapCategoryWithCount(category: ElementCategoryRow, elements: Int): ElementCategoryWithCount {
        return ElementCategoryWithCount(
            id = category.id,
            name = category.name,
            elements = elements
        )
    }

}
