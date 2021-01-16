package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.CreateElementCategory
import no.vargstudios.bifrost.server.api.model.ElementCategory
import no.vargstudios.bifrost.server.db.ElementCategoryDao
import no.vargstudios.bifrost.server.db.model.ElementCategoryRow
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1/categories")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class CategoryApi(val elementCategoryDao: ElementCategoryDao) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    @GET
    fun listCategories(): List<ElementCategory> {
        return elementCategoryDao.list().map { mapCategory(it) }
    }

    @POST
    fun createCategory(createCategory: CreateElementCategory): ElementCategory {
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
        val category = elementCategoryDao.get(categoryId) ?: throw NotFoundException()
        return mapCategory(category)
    }

    private fun mapCategory(category: ElementCategoryRow): ElementCategory {
        return ElementCategory(
            id = category.id,
            name = category.name
        )
    }

}
