package no.vargstudios.bifrost.server.db

import no.vargstudios.bifrost.server.db.model.ElementVersionRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementVersionDao {

    @SqlUpdate(
        """
        insert into element_versions (id, element_id, name, width, height, filetype)
        values (:version.id, :version.elementId, :version.name, :version.width, :version.height, :version.filetype)
        """
    )
    fun insert(version: ElementVersionRow)

    @SqlQuery("select * from element_versions where id = :id")
    fun get(id: String): ElementVersionRow?

    @SqlQuery("select * from element_versions where element_id = :elementId")
    fun listForElement(elementId: String): List<ElementVersionRow>

    @SqlUpdate("delete from element_versions where element_id = :elementId")
    fun deleteForElement(elementId: String)

}
