package no.vargstudios.bifrost.db

import no.vargstudios.bifrost.db.model.ElementVersionRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementVersionDao {

    @SqlUpdate(
        """
        insert into element_versions (id, element_id, name, width, height, filetype, bytes)
        values (:version.id, :version.elementId, :version.name, :version.width, :version.height, :version.filetype, :version.bytes)
        """
    )
    fun insert(version: ElementVersionRow)

    @SqlQuery("select * from element_versions where id = :id")
    fun get(id: String): ElementVersionRow?

    @SqlQuery("select * from element_versions where element_id = :elementId")
    fun listForElement(elementId: String): List<ElementVersionRow>

}
