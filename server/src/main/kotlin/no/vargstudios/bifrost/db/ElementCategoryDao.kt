package no.vargstudios.bifrost.db

import no.vargstudios.bifrost.db.model.ElementCategoryRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementCategoryDao {

    @SqlUpdate("""
        insert into element_categories (id, name, created)
        values (:category.id, :category.name, :category.created)
        """)
    fun insert(category: ElementCategoryRow)

    @SqlQuery("select * from element_categories")
    fun list(): List<ElementCategoryRow>

    @SqlQuery("select * from element_categories where id = :id")
    fun get(id: String): ElementCategoryRow?

}
